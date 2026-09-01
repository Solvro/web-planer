"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useHoverDirty } from "react-use";
import { toast } from "sonner";

import { deletePlan, getPlan } from "@/actions/plans";
import { plansIds } from "@/atoms/plans-ids";
import { TYPE_BAR } from "@/components/schedule/type-colors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlan } from "@/lib/use-plan";
import { cn, pluralize } from "@/lib/utils";
import { generateICSFile } from "@/lib/utils/generate-ics-file";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function PlanItem({
  id,
  name,
  synced,
  onlineId,
  onlineOnly = false,
  groupsCount = 0,
  coursesCount = 0,
  registrationsCount = 0,
  updatedAt = new Date(),
}: {
  id: string;
  name: string;
  synced: boolean;
  onlineId: string | null;
  onlineOnly?: boolean;
  groupsCount?: number;
  coursesCount?: number;
  registrationsCount?: number;
  updatedAt?: Date;
}) {
  const uuid = React.useMemo(() => crypto.randomUUID(), []);
  const uuidToCopy = React.useMemo(() => crypto.randomUUID(), []);
  const [plans, setPlans] = useAtom(plansIds);
  const plan = usePlan({ planId: onlineOnly ? uuid : id });
  const planToCopy = usePlan({ planId: uuid });
  const router = useRouter();
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const [dropdownOpened, setDropdownOpened] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(ref as React.RefObject<Element>);

  const copyPlan = () => {
    setDropdownOpened(false);

    if (!plans.some((p) => p.id === uuidToCopy)) {
      void window.umami?.track("Create plan", {
        numberOfPlans: plans.length,
      });

      setPlans([...plans, { id: uuidToCopy }]);
      planToCopy.setPlan({
        ...planToCopy,
        courses: plan.courses,
      });
    }

    router.push(`/plans/edit/${uuidToCopy}`);
  };

  const createFromOnlinePlan = () => {
    if (!plans.some((p) => p.id === id)) {
      setPlans([...plans, { id }]);
      plan.setPlan({
        ...plan,
        id,
        onlineId,
        name,
        createdAt: new Date(),
      });
    }

    router.push(`/plans/edit/${id}`);
  };

  const handleDeletePlan = async () => {
    setLoading(true);
    if (onlineId !== null) {
      const response = await deletePlan({ id: onlineId });
      if (!response.success) {
        toast.error(response.message);
        setLoading(false);
        return;
      }
    }
    plan.remove();
    setPlans(plans.filter((p) => p.id !== id));
    toast.success("Plan został usunięty.");
    router.refresh();
  };

  const allLocalGroups = plan.courses.flatMap((c) => c.groups);
  const groupCountLocal = allLocalGroups.filter(
    (group) => group.isChecked,
  ).length;
  const totalGroupsLocal = allLocalGroups.length;

  const registrationsLength = plan.registrations.length;
  const coursesLength = plan.courses.length;
  const coursesTotal = coursesCount || coursesLength;
  const hasLocalSelectionData = totalGroupsLocal > 0;
  const coursesWithSelectionLocal = new Set(
    allLocalGroups
      .filter((group) => group.isChecked)
      .map((group) => group.courseId),
  ).size;
  const groupsTotal = groupsCount || totalGroupsLocal;
  const groupsSelected = groupsCount || groupCountLocal;
  const queryClient = useQueryClient();

  const usedTypes = [
    ...new Set(
      allLocalGroups.filter((g) => g.isChecked).map((g) => g.courseType),
    ),
  ];

  const handleCacheOnlinePlan = () => {
    if (plan.onlineId !== null) {
      queryClient
        .query({
          queryKey: ["onlinePlan", plan.onlineId],
          queryFn: async () => getPlan({ id: plan.onlineId ?? "" }),
        })
        .catch(() => false);
    }
  };

  useEffect(() => {
    if (isHovering) {
      handleCacheOnlinePlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);

  return (
    <Card
      className="relative flex flex-col gap-3 p-4 shadow-sm transition-all hover:shadow-md"
      ref={ref}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-lg font-semibold">{name}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            onlineOnly || synced
              ? "bg-status-ready/15 text-status-ready"
              : "bg-status-pending/15 text-status-pending",
          )}
        >
          {onlineOnly || synced ? "online" : "lokalny"}
        </span>
      </div>

      <div className="bg-muted flex h-1.5 w-full overflow-hidden rounded-full">
        {usedTypes.length > 0 ? (
          usedTypes.map((type) => (
            <span key={type} className={cn("h-full flex-1", TYPE_BAR[type])} />
          ))
        ) : groupsSelected > 0 ? (
          <span
            className="bg-primary h-full rounded-full"
            style={{
              width: `${Math.min((groupsSelected / Math.max(groupsTotal, 1)) * 100, 100).toString()}%`,
            }}
          />
        ) : (
          <span className="bg-muted h-full w-full" />
        )}
      </div>

      <div className="text-muted-foreground flex flex-col gap-0.5 text-sm">
        <p>
          {registrationsCount || registrationsLength}{" "}
          {pluralize(
            registrationsCount || registrationsLength,
            "rejestracja",
            "rejestracje",
            "rejestracji",
          )}{" "}
          · {coursesTotal} {pluralize(coursesTotal, "kurs", "kursy", "kursów")}
        </p>
        <p>
          {hasLocalSelectionData ? (
            <>
              {coursesWithSelectionLocal} z {coursesTotal}{" "}
              {pluralize(coursesTotal, "kurs", "kursy", "kursów")} wybranych
            </>
          ) : (
            <>
              {groupsCount} {pluralize(groupsCount, "grupa", "grupy", "grup")}{" "}
              wybranych
            </>
          )}
        </p>
        <p className="text-xs">
          {format(onlineOnly ? updatedAt : plan.updatedAt, "dd.MM.yyyy, HH:mm")}
        </p>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 border-t pt-3">
        <DropdownMenu open={dropdownOpened} onOpenChange={setDropdownOpened}>
          <DropdownMenuTrigger
            render={
              <Button variant="secondary" className="h-9 w-9 px-0">
                <Icons.EllipsisVertical className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" side="top" className="w-50">
            <DropdownMenuLabel>Wybierz akcję</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyPlan}>
              <Icons.Copy />
              <span>Kopiuj</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                generateICSFile(plan.allGroups, plan.name);
              }}
            >
              <Icons.Download />
              <span>Dodaj do kalendarza (.ics)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDropdownOpened(false);
                setDialogOpened(true);
              }}
            >
              <Icons.Trash />
              <span>Usuń</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {onlineOnly ? (
          <Button className="h-9 flex-1" onClick={createFromOnlinePlan}>
            <Icons.Pencil className="h-4 w-4" />
            Edytuj
          </Button>
        ) : (
          <Button
            className="h-9 flex-1"
            nativeButton={false}
            render={
              <Link href={`/plans/edit/${id}`}>
                <Icons.Pencil className="h-4 w-4" />
                Edytuj
              </Link>
            }
          />
        )}
      </div>

      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent className="max-w-[425px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Czy na pewno chcesz usunąć plan?</DialogTitle>
            <DialogDescription>Tej akcji nie da się cofnąć!</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpened(false);
              }}
              variant="secondary"
            >
              Anuluj
            </Button>
            <Button
              disabled={loading}
              onClick={() => {
                void handleDeletePlan();
              }}
              variant="destructive"
            >
              {loading ? (
                <Icons.Loader className="size-4 animate-spin" />
              ) : null}
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

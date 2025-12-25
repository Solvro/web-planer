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
import { pluralize } from "@/lib/utils";
import { generateICSFile } from "@/lib/utils/generate-ics-file";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { StatusIcon } from "./ui/status-icon";

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
  const isHovering = useHoverDirty(ref);

  const copyPlan = () => {
    setDropdownOpened(false);

    const newPlan = {
      id: uuidToCopy,
    };

    void window.umami?.track("Create plan", {
      numberOfPlans: plans.length,
    });

    setPlans([...plans, newPlan]);
    planToCopy.setPlan({
      ...planToCopy,
      courses: plan.courses,
    });

    setTimeout(() => {
      router.push(`/plans/edit/${newPlan.id}`);
    }, 200);
  };

  const createFromOnlinePlan = () => {
    const newPlan = {
      id: uuid,
    };

    setPlans([...plans, newPlan]);
    plan.setPlan({
      ...plan,
      id: uuid,
      onlineId,
      name,
      createdAt: new Date(),
    });

    setTimeout(() => {
      router.push(`/plans/edit/${newPlan.id}`);
    }, 200);
  };

  const handleDeletePlan = async () => {
    setLoading(true);
    if (onlineId !== null) {
      const response = await deletePlan({ id: Number(onlineId) });
      if (!response.success) {
        toast.error(response.message);
        setLoading(false);
        return;
      }
    }
    plan.remove();
    if (!onlineOnly) {
      setPlans(plans.filter((p) => p.id !== id));
    }
    toast.success("Plan został usunięty.");
  };

  const groupCountLocal = plan.courses
    .flatMap((c) => c.groups)
    .filter((group) => group.isChecked).length;

  const registrationsLength = plan.registrations.length;
  const coursesLength = plan.courses.length;
  const queryClient = useQueryClient();

  const handleCacheOnlinePlan = () => {
    if (plan.onlineId !== null) {
      void queryClient.prefetchQuery({
        queryKey: ["onlinePlan", plan.onlineId],
        queryFn: async () => getPlan({ id: Number(plan.onlineId) }),
      });
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
      className="relative flex aspect-square flex-col shadow-sm transition-all hover:shadow-md"
      ref={ref}
    >
      <CardHeader className="space-y-1 p-2 min-[520px]:p-4">
        <CardTitle className="leading-2 w-5/6 text-balance text-sm min-[520px]:text-lg min-[520px]:leading-4">
          {name}
        </CardTitle>
        <CardDescription>
          {format(
            onlineOnly
              ? updatedAt
              : ((plan.createdAt as Date | undefined) ?? new Date()),
            "dd.MM.yyyy - HH:mm",
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-2 pt-0 text-xs min-[520px]:p-4 min-[520px]:text-sm">
        <p>
          {registrationsCount || registrationsLength}{" "}
          {pluralize(
            registrationsCount || registrationsLength,
            "rejestracja",
            "rejestracje",
            "rejestracji",
          )}
        </p>
        <p>
          {coursesCount || coursesLength}{" "}
          {pluralize(coursesCount || coursesLength, "kurs", "kursy", "kursów")}
        </p>
        <p className="hidden min-[380px]:block">
          {groupsCount || groupCountLocal}{" "}
          {pluralize(
            groupsCount || groupCountLocal,
            "wybrana grupa",
            "wybrane grupy",
            "wybranych grup",
          )}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-2 border-t p-2 min-[520px]:p-3">
        <DropdownMenu open={dropdownOpened} onOpenChange={setDropdownOpened}>
          <DropdownMenuTrigger asChild={true}>
            <Button
              variant="secondary"
              className="h-7 w-7 px-0 min-[520px]:h-9 min-[520px]:w-9"
            >
              <Icons.EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
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
          <Button
            className="h-7 px-3 py-1.5 min-[520px]:h-9 min-[520px]:rounded-md min-[520px]:px-3"
            onClick={createFromOnlinePlan}
          >
            <Icons.Pencil className="h-4 w-4" />
            <p className="hidden min-[380px]:block">Edytuj</p>
          </Button>
        ) : (
          <Button
            className="h-7 px-3 py-1.5 min-[520px]:h-9 min-[520px]:rounded-md min-[520px]:px-3"
            asChild={true}
          >
            <Link href={`/plans/edit/${id}`}>
              <Icons.Pencil className="h-4 w-4" />
              Edytuj
            </Link>
          </Button>
        )}
      </CardFooter>

      <StatusIcon synced={synced} onlineId={onlineId} />

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

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { UserSchedulesDTO } from "@/actions/plans";
import { deletePlan, getPlan } from "@/actions/plans";
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
import { exportPlanToIcs } from "@/lib/plan/export-ics";
import { useLocalPlans } from "@/lib/plan/local-plans";
import { onlinePlanQueryKey } from "@/lib/plan/use-plan-sync";
import { cn, pluralize } from "@/lib/utils";
import type { ClassType, StoredPlan } from "@/types";

import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface PlanCardView {
  id: string;
  name: string;
  isOnline: boolean;
  onlineId: string | null;
  registrationsCount: number;
  coursesCount: number;
  groupsSelected: number;
  groupsTotal: number;
  coursesWithSelection: number | null;
  usedTypes: ClassType[];
  updatedAt: Date;
}

function localView(plan: StoredPlan): PlanCardView {
  const allGroups = plan.courses.flatMap((course) => course.groups);
  const selected = allGroups.filter((group) => group.isChecked);
  return {
    id: plan.id,
    name: plan.name,
    isOnline: plan.synced && plan.onlineId !== null,
    onlineId: plan.onlineId,
    registrationsCount: plan.registrations.length,
    coursesCount: plan.courses.length,
    groupsSelected: selected.length,
    groupsTotal: allGroups.length,
    coursesWithSelection:
      allGroups.length > 0
        ? new Set(selected.map((group) => group.courseId)).size
        : null,
    usedTypes: [...new Set(selected.map((group) => group.courseType))],
    updatedAt: new Date(plan.updatedAt),
  };
}

function onlineView(plan: UserSchedulesDTO): PlanCardView {
  return {
    id: plan.id,
    name: plan.name,
    isOnline: true,
    onlineId: plan.id,
    registrationsCount: plan.registrationsCount,
    coursesCount: plan.coursesCount,
    groupsSelected: plan.groupsCount,
    groupsTotal: plan.groupsCount,
    coursesWithSelection: null,
    usedTypes: [],
    updatedAt: new Date(plan.updatedAt),
  };
}

type PlanItemProps =
  | { local: StoredPlan; online?: undefined }
  | { local?: undefined; online: UserSchedulesDTO };

export function PlanItem(props: PlanItemProps) {
  const view =
    props.local === undefined
      ? onlineView(props.online)
      : localView(props.local);
  const localPlan = props.local;

  const router = useRouter();
  const queryClient = useQueryClient();
  const localPlans = useLocalPlans();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const prefetchOnlinePlan = () => {
    if (view.onlineId === null) {
      return;
    }
    const onlineId = view.onlineId;
    queryClient
      .query({
        queryKey: onlinePlanQueryKey(onlineId),
        queryFn: async () => getPlan({ id: onlineId }),
      })
      .catch(() => null);
  };

  const copyPlan = () => {
    if (localPlan === undefined) {
      return;
    }
    setDropdownOpened(false);
    void window.umami?.track("Create plan", {
      numberOfPlans: localPlans.ids().length,
    });
    const copy = localPlans.create({
      name: `${localPlan.name} (kopia)`,
      courses: localPlan.courses,
      registrations: localPlan.registrations,
      toCreate: localPlan.toCreate,
    });
    router.push(`/plans/edit/${copy.id}`);
  };

  const openOnlinePlan = () => {
    const existing = localPlans.ids().some((entry) => entry.id === view.id);
    if (!existing) {
      localPlans.create({ id: view.id, onlineId: view.id, name: view.name });
    }
    router.push(`/plans/edit/${view.id}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (view.onlineId !== null) {
        const result = await deletePlan({ id: view.onlineId });
        if (!result.ok && result.reason !== "not_found") {
          toast.error(result.message);
          return;
        }
      }
      localPlans.remove(view.id);
      toast.success("Plan został usunięty.");
      setDialogOpened(false);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  const selectionRatio =
    view.groupsTotal > 0
      ? Math.min(view.groupsSelected / view.groupsTotal, 1)
      : 0;

  return (
    <Card
      className="relative flex flex-col gap-3 p-4 shadow-sm transition-all hover:shadow-md"
      onMouseEnter={prefetchOnlinePlan}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-lg font-semibold">{view.name}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            view.isOnline
              ? "bg-status-ready/15 text-status-ready"
              : "bg-status-pending/15 text-status-pending",
          )}
        >
          {view.isOnline ? "online" : "lokalny"}
        </span>
      </div>

      <div className="bg-muted flex h-1.5 w-full overflow-hidden rounded-full">
        {view.usedTypes.length > 0 ? (
          view.usedTypes.map((type) => (
            <span key={type} className={cn("h-full flex-1", TYPE_BAR[type])} />
          ))
        ) : view.groupsSelected > 0 ? (
          <span
            className="bg-primary h-full rounded-full"
            style={{ width: `${(selectionRatio * 100).toString()}%` }}
          />
        ) : (
          <span className="bg-muted h-full w-full" />
        )}
      </div>

      <div className="text-muted-foreground flex flex-col gap-0.5 text-sm">
        <p>
          {view.registrationsCount}{" "}
          {pluralize(
            view.registrationsCount,
            "rejestracja",
            "rejestracje",
            "rejestracji",
          )}{" "}
          · {view.coursesCount}{" "}
          {pluralize(view.coursesCount, "kurs", "kursy", "kursów")}
        </p>
        <p>
          {view.coursesWithSelection === null ? (
            <>
              {view.groupsSelected}{" "}
              {pluralize(view.groupsSelected, "grupa", "grupy", "grup")}{" "}
              wybranych
            </>
          ) : (
            <>
              {view.coursesWithSelection} z {view.coursesCount}{" "}
              {pluralize(view.coursesCount, "kurs", "kursy", "kursów")}{" "}
              wybranych
            </>
          )}
        </p>
        <p className="text-xs">
          {view.isOnline ? "Zapisano" : "Utworzono"}{" "}
          {format(view.updatedAt, "dd.MM.yyyy, HH:mm")}
        </p>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 border-t pt-3">
        <DropdownMenu open={dropdownOpened} onOpenChange={setDropdownOpened}>
          <DropdownMenuTrigger
            render={
              <Button
                variant="secondary"
                className="h-9 w-9 px-0"
                aria-label="Więcej akcji"
              >
                <Icons.EllipsisVertical className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" side="top" className="w-50">
            <DropdownMenuLabel>Wybierz akcję</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {localPlan === undefined ? null : (
              <>
                <DropdownMenuItem onClick={copyPlan}>
                  <Icons.Copy />
                  <span>Kopiuj</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    exportPlanToIcs(
                      localPlan.courses
                        .filter((course) => course.isChecked)
                        .flatMap((course) => course.groups),
                      localPlan.name,
                    );
                  }}
                >
                  <Icons.Download />
                  <span>Dodaj do kalendarza (.ics)</span>
                </DropdownMenuItem>
              </>
            )}
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
        {localPlan === undefined ? (
          <Button className="h-9 flex-1" onClick={openOnlinePlan}>
            <Icons.Pencil className="h-4 w-4" />
            Edytuj
          </Button>
        ) : (
          <Button
            className="h-9 flex-1"
            nativeButton={false}
            render={
              <Link href={`/plans/edit/${view.id}`}>
                <Icons.Pencil className="h-4 w-4" />
                Edytuj
              </Link>
            }
          />
        )}
      </div>

      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent className="max-w-[425px]">
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
              disabled={deleting}
              onClick={() => {
                void handleDelete();
              }}
              variant="destructive"
            >
              {deleting ? (
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

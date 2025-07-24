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
  groupCount = 0,
  registrationCount = 0,
  updatedAt = new Date(),
}: {
  id: string;
  name: string;
  synced: boolean;
  onlineId: string | null;
  onlineOnly?: boolean;
  groupCount?: number;
  registrationCount?: number;
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
    plan.remove();
    if (!onlineOnly) {
      setPlans(plans.filter((p) => p.id !== id));
    }
    if (onlineId !== null) {
      await deletePlan({ id: Number(onlineId) });
    }
    toast.success("Plan został usunięty.");
  };

  const groupCountLocal = plan.courses
    .flatMap((c) => c.groups)
    .filter((group) => group.isChecked).length;

  const plansLength = plan.registrations.length;
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
      <CardHeader className="space-y-1 p-4">
        <CardTitle className="w-5/6 text-balance text-lg leading-4">
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
      <CardContent className="flex-1 p-4 pt-0">
        <p className="text-sm">
          {registrationCount || plansLength}{" "}
          {pluralize(
            registrationCount || plansLength,
            "kurs",
            "kursy",
            "kursów",
          )}
        </p>
        <p className="text-sm">
          {groupCount || groupCountLocal}{" "}
          {pluralize(
            groupCount || groupCountLocal,
            "wybrana grupa",
            "wybrane grupy",
            "wybranych grup",
          )}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-2 border-t p-3">
        <DropdownMenu open={dropdownOpened} onOpenChange={setDropdownOpened}>
          <DropdownMenuTrigger asChild={true}>
            <Button
              variant="secondary"
              size="iconSm"
              data-testid="plan-item-dropdown"
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
              data-testid="download-ics-menu-item"
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
          <Button size="sm" onClick={createFromOnlinePlan}>
            <Icons.Pencil className="h-4 w-4" />
            Edytuj
          </Button>
        ) : (
          <Button size="sm" asChild={true}>
            <Link href={`/plans/edit/${id}`}>
              <Icons.Pencil className="h-4 w-4" />
              Edytuj
            </Link>
          </Button>
        )}
      </CardFooter>

      <StatusIcon synced={synced} onlineId={onlineId} />

      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
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

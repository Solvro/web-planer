"use client";

import { format } from "date-fns";
import { useAtom } from "jotai";
import {
  AlertTriangleIcon,
  CloudIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  Pencil,
  RefreshCwOffIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { deletePlan } from "@/actions/plans";
import { plansIds } from "@/atoms/plansIds";
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
import { usePlan } from "@/lib/usePlan";
import { pluralize } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const PlanItem = ({
  id,
  name,
  synced,
  onlineId,
}: {
  id: string;
  name: string;
  synced: boolean;
  onlineId: string | null;
}) => {
  const uuid = React.useMemo(() => crypto.randomUUID(), []);
  const [plans, setPlans] = useAtom(plansIds);
  const plan = usePlan({ planId: id });
  const planToCopy = usePlan({ planId: uuid });
  const router = useRouter();
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const [dropdownOpened, setDropdownOpened] = React.useState(false);

  const copyPlan = () => {
    setDropdownOpened(false);

    const newPlan = {
      id: uuid,
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

  const handleDeletePlan = async () => {
    plan.remove();
    setPlans(plans.filter((p) => p.id !== id));
    if (plan.onlineId !== null) {
      await deletePlan({ id: Number(plan.onlineId) });
    }
    toast.success("Plan został usunięty.");
  };

  const groupCount = plan.courses
    .flatMap((c) => c.groups)
    .filter((group) => group.isChecked).length;

  return (
    <Card className="relative flex aspect-square flex-col shadow-sm transition-all hover:shadow-md">
      <CardHeader className="p-4">
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {format(
            (plan.createdAt as Date | undefined) ?? new Date(),
            "dd.MM.yyyy - HH:mm",
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <p className="text-sm">
          {plan.registrations.length}{" "}
          {pluralize(plan.registrations.length, "kurs", "kursy", "kursów")}
        </p>
        <p className="text-sm">
          {groupCount}{" "}
          {pluralize(
            groupCount,
            "wybrana grupa",
            "wybrane grupy",
            "wybranych grup",
          )}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-2 border-t p-3">
        <DropdownMenu open={dropdownOpened} onOpenChange={setDropdownOpened}>
          <DropdownMenuTrigger asChild={true}>
            <Button variant="secondary" size="iconSm">
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-44">
            <DropdownMenuLabel>Wybierz akcję</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyPlan}>
              <CopyIcon />
              <span>Kopiuj</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDropdownOpened(false);
                setDialogOpened(true);
              }}
            >
              <TrashIcon />
              <span>Usuń</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" asChild={true}>
          <Link href={`/plans/edit/${id}`}>
            <Pencil className="h-4 w-4" />
            Edytuj
          </Link>
        </Button>
      </CardFooter>

      <div className="absolute right-2 top-2 flex size-[40px] items-center justify-center backdrop-blur-md">
        {synced ? (
          <CloudIcon className="size-4 text-emerald-500" />
        ) : !(onlineId ?? "") ? (
          <AlertTriangleIcon className="size-4 text-rose-500" />
        ) : (
          <RefreshCwOffIcon className="size-4 text-amber-500" />
        )}
      </div>

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
              onClick={() => {
                void handleDeletePlan();
              }}
              variant="destructive"
            >
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

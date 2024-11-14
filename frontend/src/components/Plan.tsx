import { useAtom } from "jotai";
import { Pencil } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import React from "react";

import { plansIds } from "@/atoms/plansIds";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePlan } from "@/lib/usePlan";
import { cn } from "@/lib/utils";

import { DeletePlanConfirmationResponsiveDialog } from "./DeletePlanConfirmationResponsiveDialog";
import { buttonVariants } from "./ui/button";

export const Plan = ({ id, name }: { id: string; name: string }) => {
  const uuid = React.useMemo(() => crypto.randomUUID(), []);
  const [plans, setPlans] = useAtom(plansIds);
  const plan = usePlan({ planId: id });
  const planToCopy = usePlan({ planId: uuid });

  const copyPlan = () => {
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
      void router.push(`/createplan/${newPlan.id}`);
    }, 200);
  };
  const deletePlan = () => {
    plan.remove();
    setPlans(plans.filter((p) => p.id !== id));
  };
  const groupCount = plan.courses
    .flatMap((c) => c.groups)
    .filter((group) => group.isChecked).length;
  return (
    <div className="flex h-[200px] w-[200px] flex-col items-center justify-between rounded-lg border-gray-400 bg-white p-4 text-center shadow-[0_0_5px_5px_rgba(0,0,0,0.10)]">
      <div className="flex w-full justify-between">
        <div className="text-xl font-semibold">{name}</div>
        <Popover>
          <PopoverTrigger>...</PopoverTrigger>
          <PopoverContent className="w-44 p-0">
            <div className="flex flex-col items-start">
              <button
                onClick={copyPlan}
                className="w-full rounded-md rounded-b-none p-2 text-left hover:bg-slate-200"
              >
                Kopiuj
              </button>
              <DeletePlanConfirmationResponsiveDialog deletePlan={deletePlan} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="mt-2 text-gray-600">Wybrane grupy: {groupCount}</div>
      <Link
        href={`/plans/create/${id}`}
        className={buttonVariants({
          className: cn(
            "flex items-center gap-2 text-nowrap rounded-md text-lg",
          ),
        })}
      >
        Edytuj
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
};

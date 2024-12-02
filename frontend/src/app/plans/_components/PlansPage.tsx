"use client";

import { atom, useAtom } from "jotai";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import type { ExtendedCourse } from "@/atoms/planFamily";
import { planFamily } from "@/atoms/planFamily";
import { plansIds } from "@/atoms/plansIds";
import { PlanItem } from "@/components/PlanItem";
import type { Registration } from "@/lib/types";

import type { PlanResponseDataType } from "../page";

const plansAtom = atom(
  (get) => get(plansIds).map((id) => get(planFamily(id))),
  (get, set, values: Array<{ id: string }>) => {
    set(plansIds, values);
  },
);
export function PlansPage({
  plans: onlinePlans,
}: {
  plans: PlanResponseDataType[];
}) {
  const [plans, setPlans] = useAtom(plansAtom);
  const router = useRouter();
  const firstTime = useRef(true);

  const addNewPlan = () => {
    const uuid = crypto.randomUUID();
    const newPlan = {
      id: uuid,
    };

    void window.umami?.track("Create plan", {
      numberOfPlans: plans.length,
    });

    router.push(`/plans/edit/${newPlan.id}`);
    setPlans([...plans, newPlan]);
  };

  const handleCreateOfflinePlansIfNotExists = () => {
    if (firstTime.current) {
      firstTime.current = false;
      const tmpPlans: Array<{
        id: string;
        name: string;
        synced: boolean;
        onlineId: string;
        courses: ExtendedCourse[];
        registrations: Registration[];
        createdAt: Date;
        updatedAt: Date;
      }> = [];
      onlinePlans.forEach((onlinePlan) => {
        if (plans.some((plan) => plan.onlineId === onlinePlan.id.toString())) {
          return;
        }

        const uuid = crypto.randomUUID();
        const newPlan = {
          id: uuid,
          name: onlinePlan.name,
          synced: true,
          onlineId: onlinePlan.id.toString(),
          courses: onlinePlan.courses,
          registrations: onlinePlan.registrations,
          createdAt: new Date(onlinePlan.createdAt),
          updatedAt: new Date(onlinePlan.updatedAt),
        };

        tmpPlans.push(newPlan);
      });
      setPlans([...plans, ...tmpPlans]);
    }
  };

  useEffect(() => {
    handleCreateOfflinePlansIfNotExists();
  }, []);

  return (
    <div className="container mx-auto max-h-full flex-1 flex-grow overflow-y-auto p-4">
      <div className="grid grid-cols-2 gap-4 sm:justify-start md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        <button
          onClick={addNewPlan}
          className="group flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 shadow-md transition-all hover:border-primary hover:bg-primary/5 hover:shadow-xl"
        >
          <PlusIcon className="h-24 w-24 text-gray-400 transition-colors group-hover:text-primary" />
        </button>
        {plans.map((plan) => (
          <PlanItem
            key={plan.id}
            id={plan.id}
            name={plan.name}
            synced={plan.synced}
            onlineId={plan.onlineId}
          />
        ))}
      </div>
    </div>
  );
}

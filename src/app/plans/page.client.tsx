"use client";

import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { UserSchedulesDTO } from "@/actions/plans";
import { planFamily } from "@/atoms/plan-family";
import { plansIds } from "@/atoms/plans-ids";
import { Icons } from "@/components/icons";
import { PlanItem } from "@/components/plan-item";

const plansAtom = atom(
  (get) => get(plansIds).map((id) => get(planFamily(id))),
  (_get, set, values: { id: string }[]) => {
    set(plansIds, values);
  },
);
export function PlansPage({
  plans: onlinePlans,
}: {
  plans: UserSchedulesDTO[];
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

  const plansExistingLocallyAndDeletedOnline = plans.filter(
    (plan) =>
      plan.onlineId !== null &&
      !onlinePlans.some((p) => p.id === plan.onlineId),
  );

  const handleDeleteDeletedPlans = () => {
    firstTime.current = false;
    setPlans(
      plans.filter(
        (plan) =>
          !plansExistingLocallyAndDeletedOnline.some((p) => p.id === plan.id),
      ),
    );
    toast.success("Usunięto plany, które usunąłeś na innym urządzeniu.", {
      duration: 5000,
    });
  };

  useEffect(() => {
    if (firstTime.current && plansExistingLocallyAndDeletedOnline.length > 0) {
      handleDeleteDeletedPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plansExistingLocallyAndDeletedOnline]);

  return (
    <div className="container mx-auto max-h-full flex-1 grow overflow-y-auto p-4 pt-24">
      <div className="grid grid-cols-2 gap-4 sm:justify-start md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <button
          onClick={addNewPlan}
          className="group hover:border-primary hover:bg-primary/5 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 shadow-md transition-all hover:shadow-xl dark:border-gray-800"
        >
          <Icons.Plus className="group-hover:text-primary h-24 w-24 text-gray-400 transition-colors dark:text-gray-600" />
        </button>
        {plans.map((plan) =>
          onlinePlans.some((onlinePlan) => onlinePlan.id === plan.id) ? null : (
            <PlanItem
              key={plan.id}
              id={plan.id}
              name={plan.name}
              synced={plan.synced}
              onlineId={plan.onlineId}
            />
          ),
        )}
        {onlinePlans.map((plan) => {
          return (
            <PlanItem
              key={plan.id}
              id={plan.id}
              name={plan.name}
              synced={true}
              onlineId={plan.id}
              onlineOnly={true}
              groupsCount={plan.groupsCount}
              coursesCount={plan.coursesCount}
              registrationsCount={plan.registrationsCount}
              updatedAt={new Date(plan.updatedAt)}
            />
          );
        })}
      </div>
    </div>
  );
}

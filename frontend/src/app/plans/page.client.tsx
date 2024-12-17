"use client";

import { atom, useAtom } from "jotai";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { planFamily } from "@/atoms/plan-family";
import { plansIds } from "@/atoms/plans-ids";
import { PlanItem } from "@/components/plan-item";

import type { PlanResponseDataType } from "./page";

const plansAtom = atom(
  (get) => get(plansIds).map((id) => get(planFamily(id))),
  (_get, set, values: { id: string }[]) => {
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

  const plansExistingLocallyAndDeletedOnline = plans.filter(
    (plan) =>
      plan.onlineId !== null &&
      !onlinePlans.some((p) => p.id.toString() === plan.onlineId),
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
        {onlinePlans.map((plan) => {
          if (plans.some((p) => p.onlineId === plan.id.toString())) {
            return null;
          }
          return (
            <PlanItem
              key={plan.id}
              id={plan.id.toString()}
              name={plan.name}
              synced={true}
              onlineId={plan.id.toString()}
              onlineOnly={true}
              groupCount={plan.courses.flatMap((c) => c.groups).length}
              registrationCount={plan.registrations.length}
              updatedAt={new Date(plan.updatedAt)}
            />
          );
        })}
      </div>
    </div>
  );
}

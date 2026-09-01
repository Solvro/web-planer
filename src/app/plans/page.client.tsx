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
import { Button } from "@/components/ui/button";

const plansAtom = atom(
  (get) => {
    const ids = get(plansIds);
    const uniqueIds = ids.filter(
      (value, index) => ids.findIndex((v) => v.id === value.id) === index,
    );
    return uniqueIds.map((id) => get(planFamily(id)));
  },
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
    <div className="container mx-auto max-h-full flex-1 grow overflow-y-auto p-4 pt-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Moje plany</h1>
          {plans.length > 0 ? (
            <p className="text-muted-foreground text-sm">
              Ostatnio edytowany{" "}
              {new Date(
                Math.max(...plans.map((p) => new Date(p.updatedAt).getTime())),
              ).toLocaleString("pl-PL")}
            </p>
          ) : null}
        </div>
        <Button onClick={addNewPlan}>
          <Icons.Plus className="size-4" />
          Nowy plan
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan) => (
          <PlanItem
            key={plan.id}
            id={plan.id}
            name={plan.name}
            synced={plan.synced}
            onlineId={plan.onlineId}
          />
        ))}
        {onlinePlans
          .filter(
            (onlinePlan) => !plans.some((plan) => plan.id === onlinePlan.id),
          )
          .map((plan) => (
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
          ))}
      </div>
    </div>
  );
}

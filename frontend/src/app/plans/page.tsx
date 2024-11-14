"use client";

import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { planFamily } from "@/atoms/planFamily";
import { plansIds } from "@/atoms/plansIds";
import { Plan } from "@/components/Plan";
import { Button } from "@/components/ui/button";

const plansAtom = atom(
  (get) => get(plansIds).map((id) => get(planFamily(id))),
  (get, set, values: Array<{ id: string }>) => {
    set(plansIds, values);
  },
);
const Plans = () => {
  const [plans, setPlans] = useAtom(plansAtom);
  const router = useRouter();
  const uuid = crypto.randomUUID();
  const addNewPlan = () => {
    const newPlan = {
      id: uuid,
    };

    void window.umami?.track("Create plan", {
      numberOfPlans: plans.length,
    });

    router.push(`/plans/create/${newPlan.id}`)
    setPlans([...plans, newPlan]);
  };

  return (
    <div className="container mx-auto max-h-full flex-1 flex-grow overflow-y-auto p-4">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
        <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 shadow-xl">
          <Button onClick={addNewPlan}>Dodaj nowy plan</Button>
        </div>
        {plans.map((plan) => (
          <Plan key={plan.id} id={plan.id} name={plan.name} />
        ))}
      </div>
    </div>
  );
};

export default Plans;

"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { planFamily } from "@/atoms/plan-family";
import { plansIds } from "@/atoms/plans-ids";
import { Icons } from "@/components/icons";
import { WeekGrid } from "@/components/schedule/week-grid";
import { Button } from "@/components/ui/button";
import type { SharedPlan } from "@/types";

export function SharePlanPage({ plan }: { plan: SharedPlan["plan"] }) {
  const uuid = useMemo(() => uuidv4(), []);
  const [plans, setPlans] = useAtom(plansIds);
  const [planToCopy, setPlanToCopy] = useAtom(planFamily({ id: uuid }));

  const router = useRouter();
  const captureRef = useRef<HTMLDivElement>(null);

  const copyPlan = () => {
    const newPlan = {
      id: uuid,
      ...plan,
    };

    void window.umami?.track("Create plan", {
      numberOfPlans: plans.length,
    });

    setPlans([...plans, newPlan]);
    setPlanToCopy({
      ...planToCopy,
      ...plan,
    });

    setTimeout(() => {
      router.push(`/plans/edit/${newPlan.id}`);
    }, 200);
  };

  return (
    <div className="flex w-full grow flex-col overflow-x-auto pt-16">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:px-14">
        <h1 className="text-xl font-semibold">{plan.name}</h1>

        <div className="flex items-center gap-1">
          <Button size="sm" className="bg-white text-black" onClick={copyPlan}>
            <Icons.Copy className="size-4" />
            Skopiuj do siebie
          </Button>
        </div>
      </div>

      <div ref={captureRef} className="bg-background scrollbar-thin p-1">
        <WeekGrid
          allGroups={plan.allGroups.filter((g) => g.isChecked)}
          selectedGroups={[]}
          isReadonly={true}
        />
      </div>
    </div>
  );
}

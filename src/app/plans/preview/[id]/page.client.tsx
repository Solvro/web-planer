"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Icons } from "@/components/icons";
import { WeekGrid } from "@/components/schedule/week-grid";
import { Button } from "@/components/ui/button";
import { useLocalPlans } from "@/lib/plan/local-plans";
import type { SharedPlan } from "@/types";

export function SharePlanPage({ plan }: { plan: SharedPlan["plan"] }) {
  const router = useRouter();
  const localPlans = useLocalPlans();

  const selectedGroups = useMemo(
    () => plan.allGroups.filter((group) => group.isChecked),
    [plan.allGroups],
  );

  const copyPlan = () => {
    void window.umami?.track("Create plan", {
      numberOfPlans: localPlans.ids().length,
    });
    const copy = localPlans.create({
      name: plan.name,
      courses: plan.courses,
      registrations: plan.registrations,
      toCreate: false,
    });
    router.push(`/plans/edit/${copy.id}`);
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

      <div className="bg-background scrollbar-thin p-1">
        <WeekGrid
          allGroups={selectedGroups}
          selectedGroups={[]}
          collisions={[]}
          isReadonly={true}
        />
      </div>
    </div>
  );
}

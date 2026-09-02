"use client";

import { useMemo } from "react";

import { ScheduleBoard } from "@/components/schedule/schedule-board";
import { SidebarInset } from "@/components/ui/sidebar";
import { useHydrated } from "@/hooks/use-hydrated";
import { usePlan } from "@/lib/plan/use-plan";
import { usePlanSync } from "@/lib/plan/use-plan-sync";
import { detectCollisions } from "@/lib/utils/detect-collisions";

import { AppSidebar } from "./_components/app-sidebar";
import { SharePlanDialog } from "./_components/share-plan-dialog";
import EditPlanLoading from "./loading";

export function CreateNewPlanPage({ planId }: { planId: string }) {
  const hydrated = useHydrated();

  // Plan state lives in localStorage; render it only once we are in the browser.
  if (!hydrated) {
    return <EditPlanLoading />;
  }

  return <PlanEditor planId={planId} />;
}

function PlanEditor({ planId }: { planId: string }) {
  const plan = usePlan(planId);
  const sync = usePlanSync(plan);

  const collisions = useMemo(
    () => detectCollisions(plan.selectedGroups),
    [plan.selectedGroups],
  );

  return (
    <>
      <AppSidebar plan={plan} sync={sync} collisions={collisions} />
      <SidebarInset className="mr-1 w-full overflow-x-auto overflow-y-auto bg-transparent pt-14">
        <div className="ml-2 flex h-full w-full flex-1 grow flex-col items-start p-2 md:ml-0 md:w-auto">
          <ScheduleBoard
            allGroups={plan.allGroups}
            selectedGroups={plan.selectedGroups}
            collisions={collisions}
            onSelectGroup={plan.selectGroup}
          />
        </div>
      </SidebarInset>
      <SharePlanDialog plan={plan} />
    </>
  );
}

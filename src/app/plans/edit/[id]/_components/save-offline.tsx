import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect } from "react";

import { useSavePlan } from "@/hooks/use-save-plan";
import type { usePlanType } from "@/lib/use-plan";
import type { CourseType, PlanResponseType } from "@/types";

export function SaveOfflineFunction({
  plan,
  onlinePlan,
  coursesFunction,
}: {
  plan: usePlanType;
  onlinePlan: PlanResponseType | null | undefined;
  coursesFunction: UseMutationResult<CourseType, Error, string>;
}) {
  const { handleUpdateLocalPlan, firstTime } = useSavePlan({
    plan,
    onlinePlan,
    coursesFunction,
    refetchOnlinePlan: () => null,
  });

  useEffect(() => {
    if (
      onlinePlan != null &&
      plan.onlineId !== null &&
      plan.toCreate &&
      firstTime
    ) {
      void handleUpdateLocalPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, onlinePlan]);

  return null;
}

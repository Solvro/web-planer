import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { usePlanType } from "@/lib/use-plan";
import { updateLocalPlan } from "@/lib/utils/update-local-plan";
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
  const firstTime = useRef(true);

  const handleUpdateLocalPlan = async () => {
    firstTime.current = false;
    const response = await updateLocalPlan(onlinePlan, coursesFunction);

    if (response.status === "SUCCESS") {
      const { updatedRegistrations, updatedCourses, updatedAt } = response;
      plan.setPlan({
        ...plan,
        registrations: updatedRegistrations,
        courses: updatedCourses,
        synced: true,
        toCreate: false,
        updatedAt,
      });
    } else {
      toast.error(response.message, {
        duration: 10_000,
      });
    }
  };

  useEffect(() => {
    if (
      onlinePlan != null &&
      plan.onlineId !== null &&
      plan.toCreate &&
      firstTime.current
    ) {
      void handleUpdateLocalPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, onlinePlan]);

  return null;
}

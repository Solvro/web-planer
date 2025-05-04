import type {
  QueryObserverResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";

import type { usePlanType } from "@/lib/use-plan";
import { createOnlinePlan } from "@/lib/utils/create-online-plan";
import { syncPlan } from "@/lib/utils/sync-plan";
import { updateLocalPlan } from "@/lib/utils/update-local-plan";
import type { CourseType, PlanResponseType } from "@/types";

export const useSavePlan = ({
  plan,
  onlinePlan,
  coursesFunction,
  refetchOnlinePlan,
}: {
  plan: usePlanType;
  onlinePlan: PlanResponseType | null | undefined;
  coursesFunction: UseMutationResult<CourseType, Error, string>;
  refetchOnlinePlan: () => Promise<
    QueryObserverResult<PlanResponseType | null>
  >;
}) => {
  const [syncing, setSyncing] = useState(false);
  const firstTime = useRef(true);

  const handleSyncPlan = async () => {
    setSyncing(true);
    const response = await syncPlan(plan);

    if (response.status === "SUCCESS") {
      await refetchOnlinePlan();

      plan.setPlan((previous) => ({
        ...previous,
        synced: true,
        updatedAt: response.updatedAt
          ? new Date(response.updatedAt)
          : new Date(),
      }));
    } else {
      toast.error(response.message, {
        duration: 10_000,
      });
    }
    setSyncing(false);
  };

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

  const handleCreateOnlinePlan = async (
    setOfflineAlert: (value: boolean) => void,
  ) => {
    firstTime.current = false;
    const response = await createOnlinePlan(plan);

    if (response.status === "SUCCESS") {
      const { updatedAt, onlineId } = response;
      plan.setPlan((previous) => ({
        ...previous,
        synced: true,
        updatedAt: new Date(updatedAt),
        onlineId,
      }));

      toast.success("Utworzono plan");
    } else if (response.status === "NOT_LOGGED_IN") {
      setOfflineAlert(true);
    } else {
      toast.error("Nie udało się utworzyć planu w wersji online", {
        description: response.message,
        duration: 10_000,
      });
    }
  };

  return {
    syncing,
    handleSyncPlan,
    handleUpdateLocalPlan,
    handleCreateOnlinePlan,
    firstTime: firstTime.current,
  };
};

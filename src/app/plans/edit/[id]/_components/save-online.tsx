import { useEffect } from "react";
import { useDebounce } from "react-use";

import type { usePlanType } from "@/lib/use-plan";
import type { User } from "@/types";

export function SaveOnlineFunction({
  plan,
  setOfflineAlert,
  handleCreateOnlinePlan,
  user,
  offlineAlert,
  handleSyncPlan,
}: {
  plan: usePlanType;
  setOfflineAlert: (value: boolean) => void;
  handleCreateOnlinePlan: (
    alertSetter: (value: boolean) => void,
  ) => Promise<void>;
  user: User | null;
  offlineAlert: boolean;
  handleSyncPlan: () => Promise<void>;
}) {
  useEffect(() => {
    if (plan.onlineId === null) {
      void handleCreateOnlinePlan(setOfflineAlert);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.onlineId]);

  useDebounce(
    () => {
      if (
        user != null &&
        !plan.synced &&
        plan.onlineId !== null &&
        !offlineAlert &&
        !plan.toCreate
      ) {
        void handleSyncPlan();
      }
    },
    4000,
    [user, plan.synced, plan.onlineId, offlineAlert, plan.toCreate],
  );

  return null;
}

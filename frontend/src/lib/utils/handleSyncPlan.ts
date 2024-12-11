import { toast } from "sonner";

import { updatePlan } from "@/actions/plans";
import type { PlanState } from "@/lib/usePlan";

export const handleSyncPlan = async <T>(
  plan: PlanState,
  refetchOnlinePlan: () => Promise<T>,
  setSyncing: (value: boolean) => void,
): Promise<T | null> => {
  setSyncing(true);
  try {
    const res = await updatePlan({
      id: Number(plan.onlineId),
      name: plan.name,
      courses: plan.courses
        .filter((c) => c.isChecked)
        .map((c) => ({ id: c.id })),
      registrations: plan.registrations.map((r) => ({ id: r.id })),
      groups: plan.allGroups
        .filter((g) => g.isChecked)
        .map((g) => ({ id: g.groupOnlineId })),
    });

    if (!res.success) {
      toast.error("Nie udało się zaktualizować planu");
      return null;
    }

    await refetchOnlinePlan();

    plan.setPlan((prev) => ({
      ...prev,
      synced: true,
      updatedAt: res.schedule.updatedAt
        ? new Date(res.schedule.updatedAt)
        : new Date(),
    }));
  } catch {
    toast.error("Nie udało się zaktualizować planu");
    return null;
  } finally {
    setSyncing(false);
  }
  return null;
};

import { createNewPlan } from "@/actions/plans";
import type { PlanState } from "@/lib/usePlan";

export const createOnlinePlan = async (plan: PlanState) => {
  try {
    const courses = plan.courses
      .filter((c) => c.isChecked)
      .map((c) => ({ id: c.id }));
    const registrations = plan.registrations.map((r) => ({ id: r.id }));
    const groups = plan.allGroups
      .filter((g) => g.isChecked)
      .map((g) => ({ id: g.groupOnlineId }));

    const res = await createNewPlan({
      name: plan.name,
      courses,
      registrations,
      groups,
    });

    plan.setPlan((prev) => ({
      ...prev,
      synced: true,
      updatedAt: new Date(res.schedule.updatedAt),
      onlineId: res.schedule.id.toString(),
    }));

    return { success: true };
  } catch (err) {
    if (err instanceof Error && "message" in err) {
      if (err.message === "Not logged in") {
        return { error: "NOT_LOGGED_IN", message: err.message };
      }
      return { error: "UNKNOWN", message: err.message };
    }
    return { error: "UNKNOWN", message: "Wystąpił nieoczekiwany błąd" };
  }
};

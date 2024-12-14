import { toast } from "sonner";

import { createNewPlan } from "@/actions/plans";
import type { PlanState } from "@/lib/usePlan";

export const createOnlinePlan = async (
  plan: PlanState,
  setOfflineAlert: (value: boolean) => void,
) => {
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

    toast.success("Utworzono plan");
    return true;
  } catch (err) {
    if (err instanceof Error && "message" in err) {
      if (err.message === "Not logged in") {
        setOfflineAlert(true);
      } else {
        toast.error("Nie udało się utworzyć planu w wersji online", {
          description:
            "Wystąpił nieoczekiwany błąd. Skontaktuj się z zespołem developerów.",
          duration: 10000,
        });
      }
    }
    return false;
  }
};

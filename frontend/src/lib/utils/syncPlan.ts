import { updatePlan } from "@/actions/plans";
import type { PlanState } from "@/lib/usePlan";

type SyncPlanResult =
  | {
      status: "ERROR";
      message: string;
    }
  | {
      status: "SUCCESS";
      updatedAt: string;
    };

/**
 * Updates a plan online in database on user account.
 * @param plan **plan** object from useAtom()
 * @returns Objects ```{ status: "ERROR", message: string }``` or ```{ status: "SUCCESS", updatedAt: string }```
 */

export const syncPlan = async (plan: PlanState): Promise<SyncPlanResult> => {
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
      return {
        status: "ERROR",
        message: "Nie udało się zaktualizować planu",
      };
    }

    return { status: "SUCCESS", updatedAt: res.schedule.updatedAt };
  } catch (err) {
    return { status: "ERROR", message: "Nie udało się zaktualizować planu" };
  }
};

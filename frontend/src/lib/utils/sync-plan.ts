import { updatePlan } from "@/actions/plans";
import type { PlanState } from "@/types";

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
    const response = await updatePlan({
      id: Number(plan.onlineId),
      name: plan.name,
      sharedId: plan.sharedId,
      courses: plan.courses
        .filter((c) => c.isChecked)
        .map((c) => ({ id: c.id })),
      registrations: plan.registrations.map((r) => ({ id: r.id })),
      groups: plan.allGroups
        .filter((g) => g.isChecked)
        .map((g) => ({ id: g.groupOnlineId })),
    });

    if (!response.success) {
      return {
        status: "ERROR",
        message: "Nie udało się zaktualizować planu",
      };
    }

    return { status: "SUCCESS", updatedAt: response.schedule.updatedAt };
  } catch {
    return { status: "ERROR", message: "Nie udało się zaktualizować planu" };
  }
};

import { createNewPlan } from "@/actions/plans";
import type { PlanState } from "@/types";

type CreateOnlinePlanResult =
  | {
      status: "NOT_LOGGED_IN" | "UNKNOWN";
      message: string;
    }
  | {
      status: "SUCCESS";
      updatedAt: Date;
      onlineId: string;
    };

/**
 * Creates a new plan online in database on user account.
 * @param plan **plan** object from useAtom()
 * @returns Objects: ```{ status: "NOT_LOGGED_IN" | "UNKNOWN", message: string }``` or ```{ status: "SUCCESS" }```
 */
export const createOnlinePlan = async (
  plan: PlanState,
): Promise<CreateOnlinePlanResult> => {
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

    return {
      status: "SUCCESS",
      updatedAt: new Date(res.schedule.updatedAt),
      onlineId: res.schedule.id.toString(),
    };
  } catch (err) {
    if (err instanceof Error && "message" in err) {
      if (err.message === "Not logged in") {
        return { status: "NOT_LOGGED_IN", message: err.message };
      }
      return { status: "UNKNOWN", message: err.message };
    }
    return { status: "UNKNOWN", message: "Wystąpił nieoczekiwany błąd" };
  }
};

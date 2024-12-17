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

    const response = await createNewPlan({
      name: plan.name,
      courses,
      registrations,
      groups,
    });

    return {
      status: "SUCCESS",
      updatedAt: new Date(response.schedule.updatedAt),
      onlineId: response.schedule.id.toString(),
    };
  } catch (error) {
    if (error instanceof Error && "message" in error) {
      if (error.message === "Not logged in") {
        return { status: "NOT_LOGGED_IN", message: error.message };
      }
      return { status: "UNKNOWN", message: error.message };
    }
    return { status: "UNKNOWN", message: "Wystąpił nieoczekiwany błąd" };
  }
};

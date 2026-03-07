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

  if (response === null) {
    return { status: "NOT_LOGGED_IN", message: "Musisz się zalogować." };
  }

  return {
    status: "SUCCESS",
    updatedAt: new Date(response.schedule.updatedAt),
    onlineId: response.schedule.id.toString(),
  };
};

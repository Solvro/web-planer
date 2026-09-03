"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import * as planStore from "@/lib/plan/store";
import type { PlanPayload, UserSchedulesDTO } from "@/lib/plan/store";
import type { OnlinePlan, SharedPlan } from "@/types";

export type { UserSchedulesDTO } from "@/lib/plan/store";

export type PlanActionResult<T = null> =
  | { ok: true; data: T }
  | {
      ok: false;
      reason: "unauthorized" | "not_found" | "error";
      message: string;
    };

const UNAUTHORIZED: PlanActionResult<never> = {
  ok: false,
  reason: "unauthorized",
  message: "Musisz się zalogować.",
};

const NOT_FOUND: PlanActionResult<never> = {
  ok: false,
  reason: "not_found",
  message: "Nie znaleziono planu",
};

const getSession = async () =>
  auth.api.getSession({ headers: await headers() });

export async function createNewPlan(
  input: PlanPayload & { id: string },
): Promise<PlanActionResult<{ id: string; updatedAt: string }>> {
  const session = await getSession();
  if (session == null) {
    return UNAUTHORIZED;
  }

  try {
    const data = await planStore.createPlan(session.user.id, input);
    return { ok: true, data };
  } catch (error) {
    console.error("createNewPlan failed", error);
    return {
      ok: false,
      reason: "error",
      message: "Nie udało się utworzyć planu",
    };
  }
}

export async function updatePlan(
  input: PlanPayload & { id: string },
): Promise<PlanActionResult<{ updatedAt: string }>> {
  const session = await getSession();
  if (session == null) {
    return UNAUTHORIZED;
  }

  try {
    const { id, ...payload } = input;
    const updated = await planStore.updatePlan(session.user.id, id, payload);
    return updated === null ? NOT_FOUND : { ok: true, data: updated };
  } catch (error) {
    console.error("updatePlan failed", error);
    return {
      ok: false,
      reason: "error",
      message: "Nie udało się zaktualizować planu",
    };
  }
}

export async function sharePlan({
  id,
  snapshot,
}: {
  id: string;
  snapshot: SharedPlan["plan"];
}): Promise<PlanActionResult<{ updatedAt: string }>> {
  const session = await getSession();
  if (session == null) {
    return UNAUTHORIZED;
  }

  const updated = await planStore.sharePlan(session.user.id, id, snapshot);
  return updated === null ? NOT_FOUND : { ok: true, data: updated };
}

export async function unsharePlan({
  id,
}: {
  id: string;
}): Promise<PlanActionResult<{ updatedAt: string }>> {
  const session = await getSession();
  if (session == null) {
    return UNAUTHORIZED;
  }

  const updated = await planStore.unsharePlan(session.user.id, id);
  return updated === null ? NOT_FOUND : { ok: true, data: updated };
}

export async function getSharedPlan({
  id,
}: {
  id: string;
}): Promise<SharedPlan | null> {
  return planStore.getSharedPlan(id);
}

export async function deletePlan({
  id,
}: {
  id: string;
}): Promise<PlanActionResult> {
  const session = await getSession();
  if (session == null) {
    return UNAUTHORIZED;
  }

  const deleted = await planStore.deletePlan(session.user.id, id);

  revalidatePath("/plans");
  return deleted ? { ok: true, data: null } : NOT_FOUND;
}

/** Returns the plan or null when it does not exist, belongs to someone else or the user is logged out. */
export async function getPlan({
  id,
}: {
  id: string;
}): Promise<OnlinePlan | null> {
  const session = await getSession();
  if (session == null) {
    return null;
  }

  return planStore.getPlan(session.user.id, id);
}

/** All online plans of the current user, or null when logged out. */
export async function getUserSchedules(): Promise<UserSchedulesDTO[] | null> {
  const session = await getSession();
  if (session == null) {
    return null;
  }

  return planStore.listPlans(session.user.id);
}

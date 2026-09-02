"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { schedule } from "@/db/schema/schedule";
import { auth } from "@/lib/auth";
import type { OnlinePlan, SharedPlan } from "@/types";

export type PlanActionResult<T = null> =
  | { ok: true; data: T }
  | {
      ok: false;
      reason: "unauthorized" | "not_found" | "error";
      message: string;
    };

interface PlanPayload {
  name: string;
  courses: { id: string }[];
  registrations: { id: string }[];
  groups: { id: string }[];
}

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

const first = <T>(rows: T[]): T | undefined => rows.at(0);

const ownedPlan = (id: string, userId: string) =>
  and(eq(schedule.id, id), eq(schedule.userId, userId));

/**
 * Creates the online copy of a local plan. Idempotent: calling it again for an
 * id that already exists returns the stored timestamps instead of failing.
 */
export async function createNewPlan(
  input: PlanPayload & { id: string },
): Promise<PlanActionResult<{ id: string; updatedAt: string }>> {
  const session = await getSession();
  if (session == null) {
    return UNAUTHORIZED;
  }

  try {
    const existing = first(
      await db
        .select({ id: schedule.id, updatedAt: schedule.updatedAt })
        .from(schedule)
        .where(eq(schedule.id, input.id)),
    );

    if (existing !== undefined) {
      return {
        ok: true,
        data: { id: existing.id, updatedAt: existing.updatedAt.toISOString() },
      };
    }

    const [created] = await db
      .insert(schedule)
      .values({ ...input, userId: session.user.id })
      .returning({ id: schedule.id, updatedAt: schedule.updatedAt });

    return {
      ok: true,
      data: { id: created.id, updatedAt: created.updatedAt.toISOString() },
    };
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
    const updated = first(
      await db
        .update(schedule)
        .set(payload)
        .where(ownedPlan(id, session.user.id))
        .returning({ updatedAt: schedule.updatedAt }),
    );

    if (updated === undefined) {
      return NOT_FOUND;
    }

    return { ok: true, data: { updatedAt: updated.updatedAt.toISOString() } };
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

  const updated = first(
    await db
      .update(schedule)
      .set({ isPublic: true, publicSnapshot: snapshot })
      .where(ownedPlan(id, session.user.id))
      .returning({ updatedAt: schedule.updatedAt }),
  );

  return updated === undefined
    ? NOT_FOUND
    : { ok: true, data: { updatedAt: updated.updatedAt.toISOString() } };
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

  const updated = first(
    await db
      .update(schedule)
      .set({ isPublic: false, publicSnapshot: null })
      .where(ownedPlan(id, session.user.id))
      .returning({ updatedAt: schedule.updatedAt }),
  );

  return updated === undefined
    ? NOT_FOUND
    : { ok: true, data: { updatedAt: updated.updatedAt.toISOString() } };
}

export async function getSharedPlan({
  id,
}: {
  id: string;
}): Promise<SharedPlan | null> {
  const row = first(
    await db
      .select({
        id: schedule.id,
        isPublic: schedule.isPublic,
        publicSnapshot: schedule.publicSnapshot,
      })
      .from(schedule)
      .where(eq(schedule.id, id)),
  );

  if (row === undefined || !row.isPublic || row.publicSnapshot == null) {
    return null;
  }

  return { id: row.id, plan: row.publicSnapshot };
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

  const result = await db
    .delete(schedule)
    .where(ownedPlan(id, session.user.id))
    .returning({ id: schedule.id });

  revalidatePath("/plans");
  return result.length > 0 ? { ok: true, data: null } : NOT_FOUND;
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

  const row = first(
    await db.select().from(schedule).where(ownedPlan(id, session.user.id)),
  );

  if (row === undefined) {
    return null;
  }

  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    courses: row.courses,
    groups: row.groups,
    registrations: row.registrations,
  };
}

export interface UserSchedulesDTO {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  coursesCount: number;
  registrationsCount: number;
  groupsCount: number;
}

/** All online plans of the current user, or null when logged out. */
export async function getUserSchedules(): Promise<UserSchedulesDTO[] | null> {
  const session = await getSession();
  if (session == null) {
    return null;
  }

  const rows = await db
    .select()
    .from(schedule)
    .where(eq(schedule.userId, session.user.id));

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    coursesCount: row.courses.length,
    registrationsCount: row.registrations.length,
    groupsCount: row.groups.length,
  }));
}

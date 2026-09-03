import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { schedule } from "@/db/schema/schedule";
import type { OnlinePlan, SharedPlan } from "@/types";

export interface PlanPayload {
  name: string;
  courses: { id: string }[];
  registrations: { id: string }[];
  groups: { id: string }[];
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

const first = <T>(rows: T[]): T | undefined => rows.at(0);

const ownedPlan = (id: string, userId: string) =>
  and(eq(schedule.id, id), eq(schedule.userId, userId));

/**
 * Creates the online copy of a local plan. Idempotent: calling it again for an
 * id that already exists returns the stored timestamps instead of failing.
 */
export async function createPlan(
  userId: string,
  input: PlanPayload & { id: string },
): Promise<{ id: string; updatedAt: string }> {
  const existing = first(
    await db
      .select({ id: schedule.id, updatedAt: schedule.updatedAt })
      .from(schedule)
      .where(eq(schedule.id, input.id)),
  );

  if (existing !== undefined) {
    return { id: existing.id, updatedAt: existing.updatedAt.toISOString() };
  }

  const [created] = await db
    .insert(schedule)
    .values({ ...input, userId })
    .returning({ id: schedule.id, updatedAt: schedule.updatedAt });

  return { id: created.id, updatedAt: created.updatedAt.toISOString() };
}

export async function updatePlan(
  userId: string,
  id: string,
  payload: PlanPayload,
): Promise<{ updatedAt: string } | null> {
  const updated = first(
    await db
      .update(schedule)
      .set(payload)
      .where(ownedPlan(id, userId))
      .returning({ updatedAt: schedule.updatedAt }),
  );

  return updated === undefined
    ? null
    : { updatedAt: updated.updatedAt.toISOString() };
}

export async function sharePlan(
  userId: string,
  id: string,
  snapshot: SharedPlan["plan"],
): Promise<{ updatedAt: string } | null> {
  const updated = first(
    await db
      .update(schedule)
      .set({ isPublic: true, publicSnapshot: snapshot })
      .where(ownedPlan(id, userId))
      .returning({ updatedAt: schedule.updatedAt }),
  );

  return updated === undefined
    ? null
    : { updatedAt: updated.updatedAt.toISOString() };
}

export async function unsharePlan(
  userId: string,
  id: string,
): Promise<{ updatedAt: string } | null> {
  const updated = first(
    await db
      .update(schedule)
      .set({ isPublic: false, publicSnapshot: null })
      .where(ownedPlan(id, userId))
      .returning({ updatedAt: schedule.updatedAt }),
  );

  return updated === undefined
    ? null
    : { updatedAt: updated.updatedAt.toISOString() };
}

export async function getSharedPlan(id: string): Promise<SharedPlan | null> {
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

export async function deletePlan(userId: string, id: string): Promise<boolean> {
  const result = await db
    .delete(schedule)
    .where(ownedPlan(id, userId))
    .returning({ id: schedule.id });

  return result.length > 0;
}

/** Returns the plan or null when it does not exist or belongs to someone else. */
export async function getPlan(
  userId: string,
  id: string,
): Promise<OnlinePlan | null> {
  const row = first(
    await db.select().from(schedule).where(ownedPlan(id, userId)),
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

/** All online plans belonging to the given user. */
export async function listPlans(userId: string): Promise<UserSchedulesDTO[]> {
  const rows = await db
    .select()
    .from(schedule)
    .where(eq(schedule.userId, userId));

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

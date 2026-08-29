/* eslint-disable no-console */
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import type {
  CreatePlanResponseType,
  DeletePlanResponseType,
  PlanResponseType,
} from "@/types";

import { schedule } from "../db/schema/schedule";

const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export const createNewPlan = async ({
  name,
  courses,
  registrations,
  groups,
  id,
}: {
  name: string;
  courses: { id: string }[];
  registrations: { id: string }[];
  groups: { id: string }[];
  id: string;
}): Promise<CreatePlanResponseType | null> => {
  const session = await getSession();
  if (session == null) {
    return null;
  }

  const checkIsAlreadyCreated = await db
    .select()
    .from(schedule)
    .where(eq(schedule.id, id));

  if (checkIsAlreadyCreated.length > 0) {
    const result = checkIsAlreadyCreated[0];
    return {
      success: true,
      message: "Plan utworzony pomyślnie",
      schedule: {
        name,
        userId: session.user.id,
        id,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      },
    };
  }

  try {
    const result = await db
      .insert(schedule)
      .values({
        id,
        name,
        courses,
        registrations,
        groups,
        userId: session.user.id,
      })
      .returning();

    return {
      success: true,
      message: "Plan utworzony pomyślnie",
      schedule: {
        name,
        userId: session.user.id,
        id,
        createdAt: result[0].createdAt.toISOString(),
        updatedAt: result[0].updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updatePlan = async ({
  id,
  name,
  courses,
  registrations,
  groups,
}: {
  id: string;
  name: string;
  courses: { id: string }[];
  registrations: { id: string }[];
  groups: { id: string }[];
}): Promise<CreatePlanResponseType> => {
  const session = await getSession();
  if (session == null) {
    throw new Error("Not logged in");
  }

  const result = await db
    .update(schedule)
    .set({
      name,
      courses,
      registrations,
      groups,
    })
    .where(eq(schedule.id, id))
    .returning();

  return {
    success: true,
    message: "Plan zaktualizowany pomyślnie",
    schedule: {
      name,
      userId: session.user.id,
      id,
      createdAt: result[0].createdAt.toISOString(),
      updatedAt: result[0].updatedAt.toISOString(),
    },
  };
};

export const deletePlan = async ({
  id,
}: {
  id: string;
}): Promise<DeletePlanResponseType> => {
  const session = await getSession();
  if (session == null) {
    return {
      success: false,
      message: "Nie udało się usunąć planu, użytkownik niezalogowany",
    };
  }

  const result = await db
    .delete(schedule)
    .where(eq(schedule.id, id))
    .returning();
  revalidatePath("/plans");
  return result.length > 0
    ? {
        success: true,
        message: "Plan pomyślnie usunięty",
      }
    : {
        success: false,
        message: "Nie znaleziono planu",
      };
};

export const getPlan = async ({
  id,
}: {
  id: string;
}): Promise<PlanResponseType | null> => {
  const session = await getSession();
  if (session == null) {
    return null;
  }

  const scheduleFromDatabase = await db
    .select()
    .from(schedule)
    .where(eq(schedule.id, id));

  if (scheduleFromDatabase.length === 0) {
    return null;
  }

  const userSchedule = scheduleFromDatabase[0];

  const PlanResponse: PlanResponseType = {
    registrations: userSchedule.registrations,
    name: userSchedule.name,
    id: userSchedule.id,
    userId: userSchedule.userId,
    createdAt: userSchedule.createdAt.toISOString(),
    updatedAt: userSchedule.updatedAt.toISOString(),
    courses: userSchedule.courses,
    groups: userSchedule.groups,
  };

  return PlanResponse;
};

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

export const getUserSchedules = async (): Promise<
  UserSchedulesDTO[] | null
> => {
  const session = await getSession();
  if (session == null) {
    return null;
  }

  const schedules = await db
    .select()
    .from(user)
    .innerJoin(schedule, eq(user.id, schedule.userId));

  return schedules.map((userSchedule) => {
    return {
      id: userSchedule.schedule.id,
      userId: userSchedule.user.id,
      name: userSchedule.schedule.name,
      createdAt: userSchedule.schedule.createdAt.toISOString(),
      updatedAt: userSchedule.schedule.updatedAt.toISOString(),
      coursesCount: userSchedule.schedule.courses.length,
      registrationsCount: userSchedule.schedule.registrations.length,
      groupsCount: userSchedule.schedule.groups.length,
    };
  });
};

"use server";

import { revalidatePath } from "next/cache";

import { auth, fetchToAdonis } from "@/lib/auth";
import type {
  CreatePlanResponseType,
  DeletePlanResponseType,
  PlanResponseType,
} from "@/types";

export const createNewPlan = async ({
  name,
  courses,
  registrations,
  groups,
}: {
  name: string;
  courses: { id: string }[];
  registrations: { id: string }[];
  groups: { id: number }[];
}) => {
  try {
    await auth();

    const data = await fetchToAdonis<CreatePlanResponseType>({
      url: "/user/schedules",
      method: "POST",
      body: JSON.stringify({ name, courses, registrations, groups }),
    });
    if (data === null) {
      return null;
    }
    revalidatePath("/plans");
    return data;
  } catch {
    return null;
  }
};

export const updatePlan = async ({
  id,
  name,
  sharedId,
  courses,
  registrations,
  groups,
}: {
  id: number;
  name: string;
  sharedId: string | null;
  courses: { id: string }[];
  registrations: { id: string }[];
  groups: { id: number }[];
}) => {
  await auth();

  const data = await fetchToAdonis<CreatePlanResponseType>({
    url: `/user/schedules/${id.toString()}`,
    method: "PATCH",
    body: JSON.stringify({ name, sharedId, courses, registrations, groups }),
  });

  if (data === null) {
    throw new Error("Failed to update plan");
  }
  return data;
};

export const deletePlan = async ({ id }: { id: number }) => {
  try {
    await auth();
    const data = await fetchToAdonis<DeletePlanResponseType>({
      url: `/user/schedules/${id.toString()}`,
      method: "DELETE",
    });
    if (data === null) {
      throw new Error("Failed to delete plan");
    }
    revalidatePath("/plans");
    return data;
  } catch {
    throw new Error("Not logged in");
  }
};

export const getPlan = async ({ id }: { id: number }) => {
  try {
    await auth();
    const data = await fetchToAdonis<PlanResponseType>({
      url: `/user/schedules/${id.toString()}`,
      method: "GET",
    });
    if (data === null) {
      return false;
    }
    return data;
  } catch {
    return null;
  }
};

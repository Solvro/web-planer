"use server";

import { revalidatePath } from "next/cache";

import { auth, fetchToAdonis } from "@/lib/auth";

interface CreatePlanResponseType {
  success: boolean;
  message: string;
  schedule: {
    name: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    id: number;
  };
}

interface PlanResponseType {
  name: string;
  userId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  courses: Array<{
    id: string;
    name: string;
    department: string;
    lecturer: string;
    type: string;
    ects: number;
    semester: number;
    groups: Array<{
      id: number;
      name: string;
      day: string;
      time: string;
      room: string;
    }>;
  }>;
  registrations: Array<{
    id: string;
    name: string;
  }>;
}

interface DeletePlanResponseType {
  success: boolean;
  message: string;
}

export const createNewPlan = async ({
  name,
  courses,
  registrations,
  groups,
}: {
  name: string;
  courses: Array<{ id: string }>;
  registrations: Array<{ id: string }>;
  groups: Array<{ id: number }>;
}) => {
  try {
    await auth();

    const data = await fetchToAdonis<CreatePlanResponseType>({
      url: "/user/schedules",
      method: "POST",
      body: JSON.stringify({ name, courses, registrations, groups }),
    });
    if (!data) {
      throw new Error("Failed to create new plan");
    }
    revalidatePath("/plans");
    return data;
  } catch (e) {
    throw new Error("Not logged in");
  }
};

export const updatePlan = async ({
  id,
  name,
  courses,
  registrations,
  groups,
}: {
  id: number;
  name: string;
  courses: Array<{ id: string }>;
  registrations: Array<{ id: string }>;
  groups: Array<{ id: number }>;
}) => {
  await auth();

  const data = await fetchToAdonis<CreatePlanResponseType>({
    url: `/user/schedules/${id}`,
    method: "PATCH",
    body: JSON.stringify({ name, courses, registrations, groups }),
  });
  if (!data) {
    throw new Error("Failed to update plan");
  }
  return data;
};

export const deletePlan = async ({ id }: { id: number }) => {
  try {
    await auth();
    const data = await fetchToAdonis<DeletePlanResponseType>({
      url: `/user/schedules/${id}`,
      method: "DELETE",
    });
    if (!data) {
      throw new Error("Failed to delete plan");
    }
    revalidatePath("/plans");
    return data;
  } catch (e) {
    throw new Error("Not logged in");
  }
};

export const getPlan = async ({ id }: { id: number }) => {
  try {
    await auth();
    const data = await fetchToAdonis<PlanResponseType>({
      url: `/user/schedules/${id}`,
      method: "GET",
    });
    if (!data) {
      return false;
    }
    return data;
  } catch (e) {
    return null;
  }
};

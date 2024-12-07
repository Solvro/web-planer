"use server";

import { revalidatePath } from "next/cache";

import { auth, fetchToAdonis } from "@/lib/auth";

interface CreatePlanResponseType {
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

export const createNewPlan = async ({ name }: { name: string }) => {
  const isLogged = await auth({});
  if (!isLogged) {
    return false;
  }

  const data = await fetchToAdonis<CreatePlanResponseType>({
    url: "/user/schedules",
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (!data) {
    return false;
  }
  return data;
};

export const updatePlan = async ({
  id,
  name,
  courses,
  registrations,
  groups,
  updatedAt,
}: {
  id: number;
  name: string;
  courses: Array<{ id: string }>;
  registrations: Array<{ id: string }>;
  groups: Array<{ id: number }>;
  updatedAt: string;
}) => {
  const isLogged = await auth({});
  if (!isLogged) {
    return false;
  }

  const data = await fetchToAdonis<CreatePlanResponseType>({
    url: `/user/schedules/${id}`,
    method: "PATCH",
    body: JSON.stringify({ name, courses, registrations, groups, updatedAt }),
  });
  if (!data) {
    return false;
  }
  return data;
};

export const deletePlan = async ({ id }: { id: number }) => {
  const isLogged = await auth({});
  if (!isLogged) {
    return false;
  }

  const data = await fetchToAdonis<DeletePlanResponseType>({
    url: `/user/schedules/${id}`,
    method: "DELETE",
  });
  if (!(data?.success ?? false)) {
    return false;
  }
  revalidatePath("/plans");
  return data;
};

export const getPlan = async ({ id }: { id: number }) => {
  const isLogged = await auth({});
  if (!isLogged) {
    return false;
  }

  try {
    const data = await fetchToAdonis<PlanResponseType>({
      url: `/user/schedules/${id}`,
      method: "GET",
    });
    if (!data) {
      return false;
    }
    return data;
  } catch (e) {
    return false;
  }
};

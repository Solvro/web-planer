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
}: {
  id: number;
  name: string;
  courses: Array<{ id: string }>;
  registrations: Array<{ id: string }>;
  groups: Array<{ id: number }>;
}) => {
  const isLogged = await auth({});
  if (!isLogged) {
    return false;
  }

  const data = await fetchToAdonis<CreatePlanResponseType>({
    url: `/user/schedules/${id}`,
    method: "PATCH",
    body: JSON.stringify({ name, courses, registrations, groups }),
  });
  if (!data) {
    return false;
  }
  return data;
};

export const deletePlan = async ({ id }: { id: number }) => {
  console.log(id);
  const isLogged = await auth({});
  if (!isLogged) {
    return false;
  }

  const data = await fetchToAdonis<CreatePlanResponseType>({
    url: `/user/schedules/${id}`,
    method: "DELETE",
  });
  console.log(data);
  if (!data || data.success !== true) {
    return false;
  }
  revalidatePath("/plans");
  return data;
};

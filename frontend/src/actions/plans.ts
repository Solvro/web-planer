"use server";

import type { ExtendedCourse } from "@/atoms/planFamily";
import { auth, fetchToAdonis } from "@/lib/auth";
import type { Registration } from "@/lib/types";

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
}: {
  id: number;
  name: string;
  courses: ExtendedCourse[];
  registrations: Registration[];
}) => {
  const isLogged = await auth({});
  if (!isLogged) {
    return false;
  }

  const data = await fetchToAdonis<CreatePlanResponseType>({
    url: `/user/schedules/${id}`,
    method: "PATCH",
    body: JSON.stringify({ name, courses, registrations }),
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

  const data = await fetchToAdonis<CreatePlanResponseType>({
    url: `/user/schedules/${id}`,
    method: "DELETE",
  });
  if (!data) {
    return false;
  }
  return data;
};

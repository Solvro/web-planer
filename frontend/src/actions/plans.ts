"use server";

import { ExtendedCourse } from "@/atoms/planFamily";
import { auth, fetchToAdonis } from "@/lib/auth";
import { Registration } from "@/lib/types";

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
  console.log("updatePlan data", data);
  if (!data) {
    return false;
  }
  return data;
};

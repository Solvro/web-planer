"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import type {
  CreatePlanResponseType,
  DeletePlanResponseType,
  PlanResponseType,
} from "@/types";

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
}: {
  name: string;
  courses: { id: string }[];
  registrations: { id: string }[];
  groups: { id: number }[];
}): Promise<CreatePlanResponseType | null> => {
  const session = await getSession();
  if (session == null) {
    return null;
  }

  console.log("TODO: Implement createNewPlan in API v2", {
    name,
    courses,
    registrations,
    groups,
  });

  revalidatePath("/plans");
  return null;
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
}): Promise<CreatePlanResponseType> => {
  const session = await getSession();
  if (session == null) {
    throw new Error("Not logged in");
  }

  console.log("TODO: Implement updatePlan in API v2", {
    id,
    name,
    sharedId,
    courses,
    registrations,
    groups,
  });

  throw new Error("Not implemented");
};

export const deletePlan = async ({
  id,
}: {
  id: number;
}): Promise<DeletePlanResponseType> => {
  const session = await getSession();
  if (session == null) {
    return {
      success: false,
      message: "Nie udało się usunąć planu, użytkownik niezalogowany",
    };
  }

  console.log("TODO: Implement deletePlan in API v2", { id });

  revalidatePath("/plans");
  return {
    success: false,
    message: "Not implemented",
  };
};

export const getPlan = async ({
  id,
}: {
  id: number | string;
}): Promise<PlanResponseType | null> => {
  if (typeof id === "string") {
    id = Number.parseInt(id);
  }

  const session = await getSession();
  if (session == null) {
    return null;
  }

  console.log("TODO: Implement getPlan in API v2", { id });

  return null;
};

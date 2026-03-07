"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not logged in");
  }

  return session.user;
};

export const updateUser = async (payload: { allowNotifications: boolean }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not logged in");
  }

  const ctx = await auth.$context;
  await ctx.internalAdapter.updateUser(session.user.id, {
    allowNotifications: payload.allowNotifications,
  });

  return { success: true };
};

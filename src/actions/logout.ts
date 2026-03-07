"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const signOutFunction = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });

  return true;
};

"use server";

import { cookies as cookiesPromise } from "next/headers";

import { env } from "@/env.mjs";

export const signOutFunction = async () => {
  const cookies = await cookiesPromise();
  cookies.delete({
    name: "access_token",
    path: "/",
  });
  cookies.delete({
    name: "access_token_secret",
    path: "/",
  });
  cookies.delete({
    name: "adonis-session",
    path: "/",
  });
  cookies.delete({
    name: "token",
    path: "/",
  });

  await fetch(`${env.NEXT_PUBLIC_API_URL}/user`, { method: "DELETE" });

  return true;
};

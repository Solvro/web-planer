"use server";

import { cookies as cookiesPromise } from "next/headers";

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
  await fetch("/api/v1/user", { method: "DELETE" });

  return true;
};

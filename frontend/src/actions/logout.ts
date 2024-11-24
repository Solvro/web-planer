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

  return true;
};

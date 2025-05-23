"use server";

import { cookies as cookiesPromise } from "next/headers";

import { fetchToAdonis } from "@/lib/auth";

export const signOutFunction = async () => {
  const cookies = await cookiesPromise();
  await fetchToAdonis({
    url: `/user/logout`,
    method: "DELETE",
  });

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
  cookies.delete({
    name: "XSRF-TOKEN",
    path: "/",
  });

  return true;
};

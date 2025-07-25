"use client";

import { env } from "@/env.mjs";

export const fetchClient = async ({
  url,
  method,
  body,
}: {
  url: string;
  method: RequestInit["method"];
  body?: string | null;
}): Promise<Response> => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken ?? "",
    },
    credentials: "include",
  };

  if (method !== "GET" && method !== "HEAD" && body !== undefined) {
    fetchOptions.body = body;
  }

  // eslint-disable-next-line no-console
  console.log(`${env.NEXT_PUBLIC_API_URL}${url}`, fetchOptions);

  const response = fetch(`${env.NEXT_PUBLIC_API_URL}${url}`, fetchOptions);
  return await response;
};

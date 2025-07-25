"use client";

import { env } from "@/env.mjs";

/* eslint-disable no-console */

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

  const testResponse = await fetch(env.NEXT_PUBLIC_API_URL, { method: "GET" });
  if (testResponse.ok) {
    console.log(`Successfully fetched ${env.NEXT_PUBLIC_API_URL}`);
  } else {
    console.log(`Error fetching ${env.NEXT_PUBLIC_API_URL}:`, testResponse);
  }

  const response = fetch(`${env.NEXT_PUBLIC_API_URL}${url}`, fetchOptions);
  return await response;
};

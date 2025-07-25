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

  await getTest(env.NEXT_PUBLIC_API_URL);
  await getTest("http://localhost:3333");
  await getTest("http://127.0.0.1:3333");
  await getTest("http://0.0.0.0:3333");

  const response = fetch(`${env.NEXT_PUBLIC_API_URL}${url}`, fetchOptions);
  return await response;
};

async function getTest(url: string) {
  try {
    const testResponse = await fetch(url, { method: "GET" });
    if (testResponse.ok) {
      console.log(`Successfully fetched ${url}`);
    } else {
      console.log(`Error fetching ${url}:`, testResponse);
    }
  } catch {
    console.log("URL FAILED", url);
  }
}

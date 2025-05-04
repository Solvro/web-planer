"use server";

import { cookies as cookiesPromise } from "next/headers";
import { notFound } from "next/navigation";

import { env } from "@/env.mjs";

import { extractNumber } from "../lib/utils";

export const getFaculties = async () => {
  const cookies = await cookiesPromise();
  const csrfToken = cookies.get("XSRF-TOKEN")?.value;
  const facultiesResponse = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/departments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken ?? "",
      },
    },
  ).then(
    async (r) => r.json() as Promise<{ id: string; name: string }[] | null>,
  );

  if (facultiesResponse == null) {
    return notFound();
  }

  const faculties = facultiesResponse
    .map((f) => {
      return { name: f.name, value: f.id };
    })
    .sort((a, b) => {
      const numberA = extractNumber(a.value);
      const numberB = extractNumber(b.value);

      if (numberA !== null && numberB !== null) {
        return numberA - numberB;
      } else if (numberA !== null) {
        return -1;
      } else if (numberB !== null) {
        return 1;
      }
      return a.value.localeCompare(b.value);
    });

  return faculties;
};

"use server";

import { notFound } from "next/navigation";

import { env } from "@/env.mjs";

import { extractNumber } from "../lib/utils";

export const getFaculties = async () => {
  const facultiesResponse = await fetch(`${env.SITE_URL}/api/v2/departments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (r) => {
    if (!r.ok) {
      throw new Error(
        `Failed to fetch faculties: ${r.status.toString()} ${r.statusText}`,
      );
    }
    return r.json() as Promise<{ id: string; name: string }[] | null>;
  });

  if (facultiesResponse == null) {
    return notFound();
  }

  const faculties = facultiesResponse
    .map((f) => {
      return { name: f.name, value: f.id };
    })
    .toSorted((a, b) => {
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

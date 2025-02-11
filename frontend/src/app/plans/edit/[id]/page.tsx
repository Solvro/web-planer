import type { Metadata } from "next";
import { cookies as cookiesPromise } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

import { env } from "@/env.mjs";

import { CreateNewPlanPage } from "./page.client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Kreator planu",
};

const extractNumber = (value: string): number | null => {
  const match = /W(\d+)/.exec(value);
  return match === null ? null : Number.parseInt(match[1], 10);
};

export default async function CreateNewPlan({ params }: PageProps) {
  const { id } = await params;
  if (typeof id !== "string" || id.length === 0) {
    return notFound();
  }
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

  return <CreateNewPlanPage planId={id} faculties={faculties} />;
}

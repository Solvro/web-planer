import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { CreateNewPlanPage } from "./_components/CreateNewPlanPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Kreator planu",
};

export default async function CreateNewPlan({ params }: PageProps) {
  const { id } = await params;
  if (typeof id !== "string" || id.length === 0) {
    return notFound();
  }

  const facultiesRes = (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/departments`,
  ).then((r) => r.json())) as Array<{ id: string; name: string }> | null;
  if (!facultiesRes) {
    return notFound();
  }

  const faculties = facultiesRes
    .map((f) => {
      return { name: f.name, value: f.id };
    })
    .sort((a, b) => {
      const extractNumber = (value: string): number | null => {
        const match = /W(\d+)/.exec(value);
        return match ? parseInt(match[1], 10) : null;
      };

      const numA = extractNumber(a.value);
      const numB = extractNumber(b.value);

      if (numA !== null && numB !== null) {
        return numA - numB;
      } else if (numA !== null) {
        return -1;
      } else if (numB !== null) {
        return 1;
      }
      return a.value.localeCompare(b.value);
    });

  return <CreateNewPlanPage planId={id} faculties={faculties} />;
}

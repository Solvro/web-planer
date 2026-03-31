import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { env } from "@/env.mjs";
import type { SharedPlan } from "@/types";

import { SharePlanPage } from "./page.client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Podgląd planu",
};

export default async function SharePlan({ params }: PageProps) {
  const { id } = await params;
  if (typeof id !== "string" || id.length === 0) {
    return notFound();
  }

  const result = await fetch(`${env.SITE_URL}/api/v2/shared/${id}`, {
    method: "GET",
  })
    .then(
      async (response) =>
        response.json() as Promise<{
          success: boolean;
          plan: SharedPlan;
        } | null>,
    )
    .catch(() => null);

  if (result?.success === false || result === null) {
    return notFound();
  }

  const plan = JSON.parse(
    result.plan.plan as unknown as string,
  ) as SharedPlan["plan"];

  return <SharePlanPage plan={plan} />;
}

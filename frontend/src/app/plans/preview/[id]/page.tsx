import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { fetchToAdonis } from "@/lib/auth";
import type { SharedPlan } from "@/lib/types";

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

  const result = await fetchToAdonis<{ success: boolean; plan: SharedPlan }>({
    url: `/shared/${id}`,
    method: "GET",
  });

  if (result?.success === false || result === null) {
    return notFound();
  }

  const plan = JSON.parse(
    result.plan.plan as unknown as string,
  ) as SharedPlan["plan"];

  return <SharePlanPage plan={plan} />;
}

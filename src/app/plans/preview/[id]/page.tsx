import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { getSharedPlan } from "@/actions/plans";

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

  const result = await getSharedPlan({ id });

  if (result === null) {
    return notFound();
  }

  return <SharePlanPage plan={result.plan} />;
}

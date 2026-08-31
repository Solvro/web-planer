import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { CreateNewPlanPage } from "./page.client";

export const metadata: Metadata = {
  title: "Kreator planu",
};

export default async function CreateNewPlan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (typeof id !== "string" || id.length === 0) {
    return notFound();
  }

  return <CreateNewPlanPage planId={id} />;
}

import type { Metadata } from "next";
import { cookies as cookiesPromise } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

import { getFaculties } from "@/actions/get-faculties";
import { getPlan } from "@/actions/plans";
import { auth } from "@/lib/auth";

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
  const cookies = await cookiesPromise();
  const faculties = await getFaculties(cookies);

  const isLoggedIn = (await auth({ type: "adonis" })) !== null;
  const initialPlan = await getPlan({ id });

  return (
    <CreateNewPlanPage
      planId={id}
      faculties={faculties}
      isLoggedIn={isLoggedIn}
      initialPlan={initialPlan}
    />
  );
}

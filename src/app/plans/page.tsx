import React from "react";

import type { ExtendedCourse } from "@/atoms/plan-family";
import { fetchToAdonis } from "@/lib/auth";
import type { Registration } from "@/types";

import { PlansPage } from "./page.client";

export interface PlanResponseDataType {
  id: number;
  userId: number;
  name: string;
  sharedId: string | null;
  createdAt: string;
  updatedAt: string;
  courses: ExtendedCourse[];
  registrations: Registration[];
}

export interface ErrorResponse {
  error: string;
}

type PlanResponse = ErrorResponse | PlanResponseDataType[];

export default async function Plans() {
  const data = await fetchToAdonis<PlanResponse>({
    url: "/user/schedules",
    method: "GET",
  });

  return <PlansPage plans={Array.isArray(data) ? data : []} />;
}

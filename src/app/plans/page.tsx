import React from "react";

import type { ExtendedCourse } from "@/atoms/plan-family";
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

export default function Plans() {
  return <PlansPage plans={[]} />;
}

import React from "react";

import type { ExtendedCourse } from "@/atoms/planFamily";
import { fetchToAdonis } from "@/lib/auth";
import type { Registration } from "@/lib/types";

import { PlansPage } from "./_components/PlansPage";

export interface PlanResponseDataType {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  courses: ExtendedCourse[];
  registrations: Registration[];
}

export default async function Plans() {
  const data = await fetchToAdonis<PlanResponseDataType[]>({
    url: "/user/schedules",
    method: "GET",
  });

  console.log(data);

  return <PlansPage plans={data ?? []} />;
}

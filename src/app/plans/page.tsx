import { getUserSchedules } from "@/actions/plans";
import type { ExtendedCourse } from "@/atoms/plan-family";
import type { Registration } from "@/types";

import { PlansPage } from "./page.client";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

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

export default async function Plans() {
  const userSchedules = await getUserSchedules();

  return <PlansPage plans={userSchedules ?? []} />;
}

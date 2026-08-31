import { getUserSchedules } from "@/actions/plans";

import { PlansPage } from "./page.client";

export default async function Plans() {
  const userSchedules = await getUserSchedules();

  return <PlansPage plans={userSchedules ?? []} />;
}

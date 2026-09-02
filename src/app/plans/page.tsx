import { getUserSchedules } from "@/actions/plans";

import { PlansPage } from "./page.client";

export default async function Plans() {
  const onlinePlans = await getUserSchedules();

  return <PlansPage onlinePlans={onlinePlans} />;
}

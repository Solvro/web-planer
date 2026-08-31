import { cacheLife } from "next/cache";
import "server-only";

import { env } from "@/env.mjs";
import type { Alert } from "@/lib/alerts-api";
import { fetchAlerts } from "@/lib/alerts-api";

export async function getCachedAlerts(): Promise<Alert[]> {
  "use cache";
  cacheLife("minutes");
  try {
    return await fetchAlerts(env.NEXT_PUBLIC_ALERTS_APP_CODE);
  } catch {
    // Alerts are non-critical UI; never let a failed request break the page.
    return [];
  }
}

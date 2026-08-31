import { headers } from "next/headers";
import "server-only";

import { auth } from "@/lib/auth";

export async function getCachedSession() {
  "use cache: private";
  return auth.api.getSession({ headers: await headers() });
}

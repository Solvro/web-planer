import { headers } from "next/headers";
import "server-only";

import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

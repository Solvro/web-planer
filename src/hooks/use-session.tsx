"use client";

import { authClient } from "@/lib/auth-client";

export const useSession = authClient.useSession;

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

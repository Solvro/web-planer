import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env.mjs";

import type { auth } from "./auth";
import { usosAuthClient } from "./auth/plugins/usos-auth-client";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SITE_URL,
  plugins: [
    emailOTPClient(),
    inferAdditionalFields<typeof auth>(),
    usosAuthClient(),
  ],
});

export const { signIn, signOut, useSession } = authClient;

import { usosAuthClient } from "better-auth-usos/client";
import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env.mjs";

import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SITE_URL,
  plugins: [
    emailOTPClient(),
    inferAdditionalFields<typeof auth>(),
    usosAuthClient(),
  ],
});

export const { signIn, signOut, useSession } = authClient;

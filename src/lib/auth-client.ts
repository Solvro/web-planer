import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { emailVerificationProtocolClient } from "better-auth-evp/client";
import { usosAuthClient } from "better-auth-usos/client";
import {
  emailOTPClient,
  inferAdditionalFields,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env.mjs";

import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SITE_URL,
  plugins: [
    emailOTPClient(),
    emailVerificationProtocolClient(),
    inferAdditionalFields<typeof auth>(),
    usosAuthClient(),
    passkeyClient(),
    oauthProviderClient(),
    lastLoginMethodClient(),
  ],
});

export const { signIn, signOut, useSession } = authClient;

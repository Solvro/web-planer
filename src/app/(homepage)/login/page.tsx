import { connection } from "next/server";
import { Suspense } from "react";

import { auth } from "@/lib/auth";

import { LoginClient } from "./login-client";

async function LoginClientWithNonce() {
  await connection();
  const { nonce } = await auth.api.evpGetNonce();

  return <LoginClient evpNonce={nonce} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClientWithNonce />
    </Suspense>
  );
}

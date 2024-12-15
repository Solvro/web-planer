import { cookies as cookiesPromise } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/env.mjs";
import { getRequestToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.SKIP_ENV_VALIDATION === "true") {
    return redirect(`/`);
  }
  const token = await getRequestToken();
  const cookies = await cookiesPromise();

  if (typeof token.token !== "string" || typeof token.secret !== "string") {
    return Response.json(
      {
        error: "Invalid token",
      },
      {
        status: 500,
      },
    );
  }

  cookies.set("oauth_token", token.token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });

  cookies.set("oauth_token_secret", token.secret, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });

  return redirect(
    `${env.USOS_APPS_URL}/services/oauth/authorize?oauth_token=${token.token}`,
  );
}

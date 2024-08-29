import { USOS_APPS_URL } from "@/env.mjs";
import { getRequestToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const token = await getRequestToken();

  if (typeof token.token !== "string" || typeof token.secret !== "string") {
    return Response.json(
      {
        error: "Invalid token",
      },
      {
        status: 500,
      }
    );
  }

  cookies().set("oauth_token", token.token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  cookies().set("oauth_token_secret", token.secret, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  return redirect(
    `${USOS_APPS_URL}/services/oauth/authorize?oauth_token=${token.token}`
  );
}

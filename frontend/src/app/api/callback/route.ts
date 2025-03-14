import { cookies as cookiesPromise } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { auth, getAccessToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  const url = request.nextUrl;

  const oauth_token = url.searchParams.get("oauth_token");
  const oauth_verifier = url.searchParams.get("oauth_verifier");

  if (typeof oauth_token !== "string" || typeof oauth_verifier !== "string") {
    return new Response("Bad request", {
      status: 400,
    });
  }

  const cookies = await cookiesPromise();

  const secret = cookies.get("oauth_token_secret")?.value;

  if (typeof secret !== "string") {
    return new Response("Another bad request", {
      status: 401,
    });
  }

  cookies.delete({ name: "oauth_token", path: "/" });
  cookies.delete({
    name: "oauth_token_secret",
    path: "/",
  });

  const access_token = await getAccessToken(
    oauth_token,
    oauth_verifier,
    secret,
  );

  if (
    typeof access_token.token !== "string" ||
    typeof access_token.secret !== "string"
  ) {
    return new Response("Forbidden", {
      status: 401,
    });
  }

  const payload = {
    token: access_token.token,
    secret: access_token.secret,
  };

  cookies.set("access_token", access_token.token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  cookies.set("access_token_secret", access_token.secret, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  await auth({
    payload,
    type: "usos",
  });
  return redirect("/plans");
};

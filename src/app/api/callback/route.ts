import { getAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const url = request.nextUrl;

  const oauth_token = url.searchParams.get("oauth_token");
  const oauth_verifier = url.searchParams.get("oauth_verifier");

  if (!oauth_token || !oauth_verifier) {
    return new Response("Bad request", {
      status: 400,
    });
  }

  const secret = cookies().get("oauth_token_secret")?.value;

  if (!secret) {
    return new Response("Another bad request", {
      status: 401,
    });
  }

  cookies().delete({ name: "oauth_token", path: "/" });
  cookies().delete({
    name: "oauth_token_secret",
    path: "/",
  });

  const access_token = await getAccessToken(
    oauth_token,
    oauth_verifier,
    secret
  );

  if (!access_token.token || !access_token.secret) {
    return new Response("Forbidden", {
      status: 401,
    });
  }

  cookies().set("access_token", access_token.token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });
  cookies().set("access_token_secret", access_token.secret, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  return redirect("/");
};
import { revalidatePath } from "next/cache";
import { cookies as cookiesPromise } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import { getAccessToken } from "@/lib/auth";
import { usosService } from "@/services/usos";
import { createClient } from "@/services/usos/usosClient";

export const dynamic = "force-dynamic";

const BLACKLIST = ["272695"];

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

  const tokens = {
    token: access_token.token,
    secret: access_token.secret,
  };

  const usos = usosService(createClient(tokens));
  const profile = await usos.getProfile();
  if (BLACKLIST.includes(profile.student_number)) {
    return new Response(
      `Sorry ${profile.first_name}, ale ciebie nie obsługujemy 😘`,
      {
        status: 403,
      },
    );
  }

  cookies.set("access_token", access_token.token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });
  cookies.set("access_token_secret", access_token.secret, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
  });

  revalidatePath("/plans");
  return redirect("/plans");
};

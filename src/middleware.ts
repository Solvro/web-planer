import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "./services/usos/usosClient";
import { usosService } from "./services/usos";
import { redirect } from "next/navigation";
import { env } from "./env.mjs";

export async function middleware(request: NextRequest) {
  const tokens = {
    token: request.cookies.get("access_token")?.value,
    secret: request.cookies.get("access_token_secret")?.value,
    fetch,
  };
  let isFailed = tokens.token === undefined || tokens.secret === undefined;

  let usos;
  let profile;

  if (!isFailed) {
    try {
      usos = createClient(tokens);
      profile = await usosService(usos).getProfile();
    } catch (e) {
      isFailed = true;
    }
  }

  if (isFailed) {
    request.cookies.delete("access_token");
    request.cookies.delete("access_token");

    console.log(request.nextUrl.pathname);
    if (request.nextUrl.pathname.startsWith("/app")) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      console.log("redirecting");
      response.cookies.delete("access_token");
      response.cookies.delete("access_token_secret");

      return response;
    }
  }

  return NextResponse.next();
}

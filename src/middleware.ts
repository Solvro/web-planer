import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { usosService } from "./services/usos";
import { createClient } from "./services/usos/usosClient";

export async function middleware(request: NextRequest) {
  const tokens = {
    token: request.cookies.get("access_token")?.value,
    secret: request.cookies.get("access_token_secret")?.value,
    fetch,
  };
  let isFailed = tokens.token === undefined || tokens.secret === undefined;

  let usos;

  if (!isFailed) {
    try {
      usos = createClient(tokens);
      await usosService(usos).getProfile();
    } catch (e) {
      isFailed = true;
    }
  }

  if (isFailed) {
    if (request.nextUrl.pathname.startsWith("/app")) {
      const response = NextResponse.redirect(new URL("/login", request.url));

      return response;
    }
  }

  return NextResponse.next();
}

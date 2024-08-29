import type { NextRequest } from "next/server";
import { NextResponse  } from "next/server";
import { createClient } from "./services/usos/usosClient";
import { usosService } from "./services/usos";

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
    request.cookies.delete("access_token");
    request.cookies.delete("access_token");

    if (request.nextUrl.pathname.startsWith("/app")) {
      const response = NextResponse.redirect(new URL("/login", request.url));
  
      response.cookies.delete("access_token");
      response.cookies.delete("access_token_secret");

      return response;
    }
  }

  return NextResponse.next();
}

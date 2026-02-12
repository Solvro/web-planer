import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const nextResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const payload = {
    adonisSession: request.cookies.get("adonis-session")?.value ?? "",
    token: request.cookies.get("token")?.value ?? "",
  };

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/plans/account");
  const user = await auth({ payload, type: "adonis", noThrow: true });

  if (!isProtectedRoute) {
    return nextResponse;
  }

  if (user === null) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return nextResponse;
}

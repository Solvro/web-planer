import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const nextResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/plans/account");

  if (!isProtectedRoute) {
    return nextResponse;
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (session == null) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return nextResponse;
}

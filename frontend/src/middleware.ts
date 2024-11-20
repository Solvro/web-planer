import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const tokens = {
    token: request.cookies.get("access_token")?.value,
    secret: request.cookies.get("access_token_secret")?.value,
    fetch,
  };

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/plans");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const isFailed = tokens.token === undefined || tokens.secret === undefined;

  if (isFailed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

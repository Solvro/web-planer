import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const tokens = {
    token: request.cookies.get("access_token")?.value,
    secret: request.cookies.get("access_token_secret")?.value
  };

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/account");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const isLogged = await auth(tokens);

  if (!isLogged) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

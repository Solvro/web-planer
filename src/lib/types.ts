import type { NextResponse } from "next/server";

export type ApiResponse<
  T extends (...args: any) => NextResponse | Promise<NextResponse>
> = Awaited<ReturnType<T>> extends NextResponse<infer T> ? T : never;

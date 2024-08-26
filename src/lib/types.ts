import type { NextResponse } from "next/server";

export type ApiResponse<T extends (...args: any) => NextResponse | Promise<NextResponse>> = Awaited<
  ReturnType<T>
> extends NextResponse<infer T>
  ? T
  : never;

export interface ClassBlockProps {
  startTime: string;
  endTime: string;
  group: string;
  courseName: string;
  lecturer: string;
  week: "TN" | "TP" | "";
  courseType: "W" | "L" | "C" | "S" | "P";
  registrationName: string;
}

export interface Registration {
  name: string;
}

export interface Course {
  name: string;
  registrationName: string;
  ects: number;
}

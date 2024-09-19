import type { NextResponse } from "next/server";

import type { Day } from "@/services/usos/types";

export type ApiResponse<
  T extends (...args: never[]) => NextResponse | Promise<NextResponse>,
> = Awaited<ReturnType<T>> extends NextResponse<infer Y> ? Y : never;

export interface ClassBlockProps {
  startTime: string;
  endTime: string;
  groupId: string;
  groupNumber: string;
  courseId: string;
  courseName: string;
  lecturer: string;
  day: Day;
  week: "" | "TN" | "TP";
  courseType: "C" | "L" | "P" | "S" | "W";
  registrationId: string;
}

export interface Registration {
  id: string;
  name: string;
}

export interface Course {
  name: string;
  id: string;
  type: string;
  registrationId: string;
}

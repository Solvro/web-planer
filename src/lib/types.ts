import type { NextResponse } from "next/server";

export type ApiResponse<
  T extends (...args: unknown[]) => NextResponse | Promise<NextResponse>,
> = Awaited<ReturnType<T>> extends NextResponse<infer Y> ? Y : never;

export interface ClassBlockProps {
  startTime: string;
  endTime: string;
  day: string;
  group: string;
  courseName: string;
  courseID: string;
  lecturer: string;
  week: "" | "TN" | "TP";
  courseType: "C" | "L" | "P" | "S" | "W";
  registrationName: string;
}

export interface Registration {
  name: string;
  id: string;
}

export interface Course {
  name: string;
  registrationName: string;
  ects: number;
}

export interface MockRegistration {
  registration: Registration;
  courses: Course[];
  groups: ClassBlockProps[];
}

import { NextResponse } from "next/server";

import type { ClassBlockProps, Course, Registration } from "@/lib/types";

const mockRegistration1 = {
  name: "Registration 1",
  id: "1",
} satisfies Registration;

const mockRegistration2 = {
  name: "Registration 2",
  id: "2",
} satisfies Registration;

const mockRegistration3 = {
  name: "Registration 3",
  id: "3",
} satisfies Registration;

const mockCourse1 = {
  name: "Fizyka I",
  registrationName: mockRegistration1.name,
  ects: 4,
} satisfies Course;

const mockCourse2 = {
  name: "Wykład X",
  registrationName: mockRegistration1.name,
  ects: 1,
} satisfies Course;

const mockCourse3 = {
  name: "Seminarium X",
  registrationName: mockRegistration2.name,
  ects: 5,
} satisfies Course;

const mockCourse4 = {
  name: "Cwiczenia X",
  registrationName: mockRegistration2.name,
  ects: 8,
} satisfies Course;

const mockL = {
  startTime: "17:05",
  endTime: "19:50",
  group: "1",
  day: "poniedzi",
  courseName: mockCourse1.name,
  lecturer: "Jerzy Świątek",
  week: "TN",
  courseType: "L",
  registrationName: mockCourse1.registrationName,
} satisfies ClassBlockProps;

const mockW = {
  startTime: "18:55",
  endTime: "19:50",
  day: "poniedzi",
  group: "2",
  courseName: mockCourse2.name,
  lecturer: "Jerzy Świątek",
  week: "",
  courseType: "W",
  registrationName: mockCourse2.registrationName,
} satisfies ClassBlockProps;

const mockRegistrations = [
  {
    registration: mockRegistration1,
    courses: [mockCourse1, mockCourse2],
    groups: [mockL, mockW],
  },
  {
    registration: mockRegistration2,
    courses: [mockCourse3, mockCourse4],
    groups: [],
  },
  {
    registration: mockRegistration3,
    courses: [],
    groups: [],
  },
];

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (name) {
    const registration = mockRegistrations.find(
      (reg) => reg.registration.name === name,
    );
    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(registration);
  }

  return NextResponse.json(mockRegistrations);
}

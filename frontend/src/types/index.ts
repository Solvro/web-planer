import type { Day } from "@/services/usos/types";

export interface CreatePlanResponseType {
  success: boolean;
  message: string;
  schedule: {
    name: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    id: number;
  };
}

export interface PlanResponseType {
  name: string;
  userId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  courses: Array<{
    id: string;
    name: string;
    department: string;
    lecturer: string;
    type: string;
    ects: number;
    semester: number;
    groups: Array<{
      id: number;
      name: string;
      day: string;
      time: string;
      room: string;
    }>;
  }>;
  registrations: Array<{
    id: string;
    name: string;
  }>;
}

export interface DeletePlanResponseType {
  success: boolean;
  message: string;
}

export type CourseType = Array<{
  id: string;
  name: string;
  registrationId: string;
  groups: Array<{
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    group: string;
    lecturer: string;
    week: "-" | "TN" | "TP";
    day: Day;
    type: "C" | "L" | "P" | "S" | "W";
    url: string;
    courseId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}>;

export type FacultyType = Array<{
  id: string;
  name: string;
  departmentId: string;
}>;

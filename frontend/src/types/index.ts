import type { Dispatch, SetStateAction } from "react";

import type { ExtendedCourse } from "@/atoms/plan-family";
import type { Registration } from "@/lib/types";
import type { Day } from "@/services/usos/types";

export interface User {
  firstName: string;
  lastName: string;
  studentNumber: number;
  usosId: string;
}

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
  courses: {
    id: string;
    name: string;
    department: string;
    lecturer: string;
    type: string;
    ects: number;
    semester: number;
    groups: {
      id: number;
      name: string;
      day: string;
      time: string;
      room: string;
    }[];
  }[];
  registrations: {
    id: string;
    name: string;
  }[];
}

export interface DeletePlanResponseType {
  success: boolean;
  message: string;
}

export type CourseType = {
  id: string;
  name: string;
  registrationId: string;
  groups: {
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
  }[];
}[];

export type FacultyType = {
  id: string;
  name: string;
  departmentId: string;
}[];

export interface PlanState {
  id: string;
  name: string;
  courses: ExtendedCourse[];
  registrations: Registration[];
  allGroups: ExtendedCourse["groups"];
  onlineId: string | null;
  synced: boolean;
  toCreate: boolean;
  createdAt: Date;
  updatedAt: Date;
  setPlan: SetPlanType;
}

type SetPlanType = Dispatch<
  SetStateAction<{
    id: string;
    name: string;
    courses: ExtendedCourse[];
    registrations: Registration[];
    createdAt: Date;
    updatedAt: Date;
    onlineId: string | null;
    toCreate: boolean;
    synced: boolean;
  }>
>;
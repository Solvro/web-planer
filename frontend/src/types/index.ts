import type { Dispatch, SetStateAction } from "react";

import type { ExtendedCourse } from "@/atoms/plan-family";

export enum Day {
  MONDAY = "poniedziałek",
  TUESDAY = "wtorek",
  WEDNESDAY = "środa",
  THURSDAY = "czwartek",
  FRIDAY = "piątek",
  SATURDAY = "sobota",
  SUNDAY = "niedziela",
}

export enum LessonType {
  LECTURE = "wyklad",
  EXERCISES = "cwiczenia",
  LABORATORY = "laboratorium",
  PROJECT = "projekt",
  SEMINAR = "seminarium",
}

export interface ClassBlockProps {
  startTime: string;
  endTime: string;
  groupId: string;
  groupNumber: string;
  groupOnlineId: number;
  courseId: string;
  courseName: string;
  lecturer: string;
  day: Day;
  week: "" | "TN" | "TP";
  courseType: "C" | "L" | "P" | "S" | "W";
  registrationId: string;
  spotsOccupied: number;
  spotsTotal: number;
  averageRating: number;
  opinionsCount: number;
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

export interface SharedPlan {
  id: string;
  plan: {
    name: string;
    courses: ExtendedCourse[];
    registrations: Registration[];
    allGroups: ExtendedCourse["groups"];
  };
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: number;
  usosId: string;
  avatar?: string | null | undefined;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  allowNotifications: boolean;
}

export interface UserSettingsPayload {
  allowNotifications: boolean;
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
  sharedId: string | null;
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
    spotsOccupied: number;
    spotsTotal: number;
    averageRating: number;
    createdAt: string;
    updatedAt: string;
    opinionsCount: number;
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
  sharedId: string | null;
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
    sharedId: string | null;
    courses: ExtendedCourse[];
    registrations: Registration[];
    createdAt: Date;
    updatedAt: Date;
    onlineId: string | null;
    toCreate: boolean;
    synced: boolean;
  }>
>;

export type VerifyOtpReponseType =
  | {
      success: true;
      user: User;
      isNewAccount: boolean;
    }
  | {
      success: false;
      message: string;
      errors: Record<string, string>;
    };

export interface Contributor {
  name: string;
  avatar: string;
  id: number;
  contributions: number;
}

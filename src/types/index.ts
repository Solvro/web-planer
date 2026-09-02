export enum Day {
  MONDAY = "poniedziałek",
  TUESDAY = "wtorek",
  WEDNESDAY = "środa",
  THURSDAY = "czwartek",
  FRIDAY = "piątek",
  SATURDAY = "sobota",
  SUNDAY = "niedziela",
}

export type ClassType = "C" | "L" | "P" | "S" | "W";

/** "" = every week, TN = odd weeks, TP = even weeks, "!" = irregular */
export type WeekParity = "" | "TN" | "TP" | "!";

/**
 * One class group as stored inside a plan. A group is one weekly slot
 * (day + time) that belongs to a course; `groupOnlineId` is the identifier
 * synced with the online plan, `groupId` is the local key used by the UI.
 */
export interface ExtendedGroup {
  groupId: string;
  groupNumber: string;
  groupOnlineId: string;
  courseId: string;
  courseName: string;
  courseType: ClassType;
  registrationId: string;
  lecturer: string;
  day: Day;
  week: WeekParity;
  /** "HH:MM" */
  startTime: string;
  /** "HH:MM" */
  endTime: string;
  spotsOccupied: number;
  spotsTotal: number;
  averageRating: number;
  opinionsCount: number;
  isChecked: boolean;
  /** Real meeting dates ("YYYY-MM-DD") from USOS; missing on plans saved before this field existed. */
  dates?: string[];
  /**
   * USOS course-unit id, used to fetch live spot counts and week parity
   * after the group is already shown. Missing on plans saved before this
   * field existed.
   */
  unitId?: string;
}

export interface ExtendedCourse {
  id: string;
  name: string;
  type: string;
  registrationId: string;
  isChecked: boolean;
  groups: ExtendedGroup[];
}

export interface Registration {
  id: string;
  name: string;
  departmentId: string;
}

/** Shape persisted in localStorage under `${id}-plan-v2`. */
export interface StoredPlan {
  id: string;
  name: string;
  sharedId: string | null;
  courses: ExtendedCourse[];
  registrations: Registration[];
  /** ISO date */
  createdAt: string;
  /** ISO date of the online version this local copy was last reconciled with. */
  updatedAt: string;
  onlineId: string | null;
  /** True until the plan receives content (added registration or pulled online data). */
  toCreate: boolean;
  /** False whenever there are local edits not yet pushed online. */
  synced: boolean;
  /** Incremented on every user edit; used to detect edits made while a sync was in flight. */
  revision: number;
}

export interface SharedPlan {
  id: string;
  plan: {
    name: string;
    courses: ExtendedCourse[];
    registrations: Registration[];
    allGroups: ExtendedGroup[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  firstName?: string | null;
  lastName?: string | null;
  studentNumber?: number | null;
  usosId?: string | null;
  allowNotifications?: boolean | null;
  onboardingCompleted?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnlinePlan {
  name: string;
  userId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  courses: { id: string }[];
  groups: { id: string }[];
  registrations: { id: string }[];
}

export interface ClassgroupDate {
  date: string;
  startTime: string;
  endTime: string;
}

export interface Contributor {
  name: string;
  avatar: string;
  id: number;
  contributions: number;
}

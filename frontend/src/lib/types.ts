import type { Day } from "@/services/usos/types";

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

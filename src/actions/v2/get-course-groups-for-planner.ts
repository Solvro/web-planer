"use server";

import type { GroupSchedulePattern } from "@/lib/utils/build-group-schedule-pattern";
import { buildGroupSchedulePattern } from "@/lib/utils/build-group-schedule-pattern";
import type { ClassgroupDate } from "@/types";

import type { ClassgroupDateDTO } from "./get-class-group-dates";
import { getClassgroupDatesAction } from "./get-class-group-dates";
import type { CourseGroupDTO } from "./get-course-edition-details";
import { getCourseEditionDetailsAction } from "./get-course-edition-details";
import type { LecturerDTO } from "./get-lecturer";

export interface PlannerGroupDTO {
  unitId: string;
  groupNumber: string;
  classtypeId: string;
  lecturers: LecturerDTO[];
  schedulePattern: GroupSchedulePattern | null;
  /**
   * Placeholder until `getGroupSpotsAction` (scraped, slower) fills these in
   * client-side. Left at 0 here so this action only waits on the official
   * USOS API and returns instantly.
   */
  spotsOccupied: number;
  spotsTotal: number;
}

function toClassgroupDates(dates: ClassgroupDateDTO[]): ClassgroupDate[] {
  return dates.flatMap((entry) => {
    if (entry.startTime == null || entry.endTime == null) {
      return [];
    }
    const buildingId = entry.buildingId?.trim() ?? "";
    const buildingName = entry.buildingName?.trim();
    const buildingCode = buildingName?.match(/\[([^\]]+)\]\s*$/)?.[1]?.trim();
    return [
      {
        date: entry.startTime.slice(0, 10),
        startTime: entry.startTime,
        endTime: entry.endTime,
        location:
          buildingName === "Zajęcia zdalne"
            ? buildingName
            : [
                entry.roomNumber?.trim(),
                buildingId === "" ? (buildingCode ?? buildingName) : buildingId,
              ]
                .filter(Boolean)
                .join(", "),
      },
    ];
  });
}

async function buildPlannerGroup(
  group: CourseGroupDTO,
): Promise<PlannerGroupDTO> {
  const dates = await getClassgroupDatesAction(group.unitId, group.groupNumber);
  const schedulePattern = buildGroupSchedulePattern(toClassgroupDates(dates));

  return {
    unitId: group.unitId,
    groupNumber: group.groupNumber,
    classtypeId: group.classtypeId,
    lecturers: group.lecturers,
    schedulePattern,
    spotsOccupied: 0,
    spotsTotal: 0,
  };
}

export async function getPlannerCourseGroupsAction(
  courseId: string,
  termId: string,
): Promise<PlannerGroupDTO[]> {
  const editionDetails = await getCourseEditionDetailsAction(courseId, termId);

  return Promise.all(
    editionDetails.groups.map(async (group) => buildPlannerGroup(group)),
  );
}

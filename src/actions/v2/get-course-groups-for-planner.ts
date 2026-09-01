"use server";

import type {
  GroupSchedulePattern,
  ScheduleParity,
} from "@/lib/utils/build-group-schedule-pattern";
import { buildGroupSchedulePattern } from "@/lib/utils/build-group-schedule-pattern";
import type { ClassgroupDate } from "@/types";

import { getClassgroupDatesAction } from "./get-class-group-dates";
import type { CourseGroupDTO } from "./get-course-edition-details";
import { getCourseEditionDetailsAction } from "./get-course-edition-details";
import { getGroupSpotsAction } from "./get-group-spots";
import type { LecturerDTO } from "./get-lecturer";
import { getTermAction } from "./get-term";

export interface PlannerGroupDTO {
  unitId: string;
  groupNumber: string;
  classtypeId: string;
  lecturers: LecturerDTO[];
  schedulePattern: GroupSchedulePattern | null;
  spotsOccupied: number;
  spotsTotal: number;
}

function toClassgroupDates(
  group: {
    startTime: string | null;
    endTime: string | null;
  }[],
): ClassgroupDate[] {
  return group
    .filter(
      (d): d is { startTime: string; endTime: string } =>
        d.startTime != null && d.endTime != null,
    )
    .map((d) => ({
      date: d.startTime.slice(0, 10),
      startTime: d.startTime,
      endTime: d.endTime,
    }));
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

async function getSchedulePatternParity(
  termId: string,
  classGroupStartTime: string,
): Promise<ScheduleParity> {
  const term = await getTermAction(termId);
  const weekNumber =
    Math.floor(daysBetween(classGroupStartTime, term.startDate) / 7) + 1;
  return weekNumber % 2 === 0 ? "odd" : "even";
}

async function fetchGroupWithPattern(
  group: CourseGroupDTO,
  termId: string,
): Promise<{
  group: CourseGroupDTO;
  schedulePattern: GroupSchedulePattern | null;
  spotsOccupied: number;
  spotsTotal: number;
}> {
  const [dates, spots] = await Promise.all([
    getClassgroupDatesAction(group.unitId, group.groupNumber),
    getGroupSpotsAction(group.unitId, group.groupNumber),
  ]);
  const classgroupDates = toClassgroupDates(dates);
  const schedulePattern = buildGroupSchedulePattern(classgroupDates);
  if (schedulePattern?.pattern === "biweekly") {
    schedulePattern.parity = await getSchedulePatternParity(
      termId,
      dates[1].startTime ?? "",
    );
  }
  return {
    group,
    schedulePattern,
    spotsOccupied: spots.spotsOccupied,
    spotsTotal: spots.spotsTotal,
  };
}

export async function getPlannerCourseGroupsAction(
  courseId: string,
  termId: string,
): Promise<PlannerGroupDTO[]> {
  const editionDetails = await getCourseEditionDetailsAction(courseId, termId);

  const groupsWithPatterns = await Promise.all(
    editionDetails.groups.map(async (group) =>
      fetchGroupWithPattern(group, termId),
    ),
  );

  return groupsWithPatterns.map(
    ({ group, schedulePattern, spotsOccupied, spotsTotal }) => ({
      unitId: group.unitId,
      groupNumber: group.groupNumber,
      classtypeId: group.classtypeId,
      lecturers: group.lecturers,
      schedulePattern,
      spotsOccupied,
      spotsTotal,
    }),
  );
}

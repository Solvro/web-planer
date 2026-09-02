"use server";

import type {
  GroupSchedulePattern,
  ScheduleParity,
} from "@/lib/utils/build-group-schedule-pattern";
import {
  buildGroupSchedulePattern,
  daysBetween,
  isoWeekday,
  mostFrequent,
} from "@/lib/utils/build-group-schedule-pattern";
import type { ClassgroupDate } from "@/types";

import type { ClassgroupDateDTO } from "./get-class-group-dates";
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

function toClassgroupDates(dates: ClassgroupDateDTO[]): ClassgroupDate[] {
  return dates.flatMap((entry) =>
    entry.startTime != null && entry.endTime != null
      ? [
          {
            date: entry.startTime.slice(0, 10),
            startTime: entry.startTime,
            endTime: entry.endTime,
          },
        ]
      : [],
  );
}

/** 0 for a Monday, 6 for a Sunday. */
function daysSinceMonday(date: string): number {
  return isoWeekday(date) - 1;
}

/**
 * Week 1 of the term is "odd" (TN), week 2 is "even" (TP) and so on. Weeks are
 * aligned to Mondays, so a term starting on a Wednesday still counts the
 * whole surrounding week as week 1. The parity of a group is the parity most
 * of its meetings fall into, which makes single exceptions harmless.
 */
function parityRelativeToTerm(
  dates: string[],
  termStartDate: string,
): ScheduleParity {
  const termWeekStart = daysSinceMonday(termStartDate);
  const parities = dates.map((date) => {
    const days =
      daysBetween(termStartDate, date) + termWeekStart - daysSinceMonday(date);
    const weekIndex = Math.round(days / 7);
    return weekIndex % 2 === 0 ? "odd" : "even";
  });
  return mostFrequent(parities) ?? "unknown";
}

async function resolveBiweeklyParity(
  pattern: GroupSchedulePattern,
  termId: string,
): Promise<ScheduleParity> {
  try {
    const term = await getTermAction(termId);
    return parityRelativeToTerm(pattern.dates, term.startDate);
  } catch {
    return pattern.parity;
  }
}

async function buildPlannerGroup(
  group: CourseGroupDTO,
  termId: string,
): Promise<PlannerGroupDTO> {
  const [dates, spots] = await Promise.all([
    getClassgroupDatesAction(group.unitId, group.groupNumber),
    getGroupSpotsAction(group.unitId, group.groupNumber),
  ]);

  const schedulePattern = buildGroupSchedulePattern(toClassgroupDates(dates));
  if (schedulePattern?.pattern === "biweekly") {
    schedulePattern.parity = await resolveBiweeklyParity(
      schedulePattern,
      termId,
    );
  }

  return {
    unitId: group.unitId,
    groupNumber: group.groupNumber,
    classtypeId: group.classtypeId,
    lecturers: group.lecturers,
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

  return Promise.all(
    editionDetails.groups.map(async (group) =>
      buildPlannerGroup(group, termId),
    ),
  );
}

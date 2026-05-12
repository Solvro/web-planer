import type { ClassgroupDate } from "@/types";
import type { GroupSchedulePattern } from "@/lib/utils/build-group-schedule-pattern";
import type { CourseGroupDTO } from "./get-course-edition-details";
import type { LecturerDTO } from "./get-lecturer";
import { buildGroupSchedulePattern } from "@/lib/utils/build-group-schedule-pattern";
import { getClassgroupDatesAction } from "./get-class-group-dates";
import { getCourseEditionDetailsAction } from "./get-course-edition-details";
import { getLecturerAction } from "./get-lecturer";

export interface PlannerGroupDTO {
  unitId: string;
  groupNumber: string;
  classtypeId: string;
  lecturers: LecturerDTO[];
  schedulePattern: GroupSchedulePattern | null;
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

async function fetchGroupWithPattern(group: CourseGroupDTO): Promise<{
  group: CourseGroupDTO;
  schedulePattern: GroupSchedulePattern | null;
}> {
  const dates = await getClassgroupDatesAction(group.unitId, group.groupNumber);
  const classgroupDates = toClassgroupDates(dates);
  return {
    group,
    schedulePattern: buildGroupSchedulePattern(classgroupDates),
  };
}

export async function getPlannerCourseGroupsAction(
  courseId: string,
  termId: string,
): Promise<PlannerGroupDTO[]> {
  const editionDetails = await getCourseEditionDetailsAction(courseId, termId);

  const [groupsWithPatterns, lecturersMap] = await Promise.all([
    Promise.all(
      editionDetails.groups.map(async (group) => fetchGroupWithPattern(group)),
    ),
    (async () => {
      const uniqueLecturerIds = [
        ...new Set(editionDetails.groups.flatMap((g) => g.lecturerIds)),
      ];
      const lecturerEntries = await Promise.all(
        uniqueLecturerIds.map(async (id) => {
          const lecturer = await getLecturerAction(id);
          return [id, lecturer] as const;
        }),
      );
      return new Map<string, LecturerDTO>(lecturerEntries);
    })(),
  ]);

  return groupsWithPatterns.map(({ group, schedulePattern }) => ({
    unitId: group.unitId,
    groupNumber: group.groupNumber,
    classtypeId: group.classtypeId,
    lecturers: group.lecturerIds
      .map((id) => lecturersMap.get(id))
      .filter((l): l is LecturerDTO => l != null),
    schedulePattern,
  }));
}

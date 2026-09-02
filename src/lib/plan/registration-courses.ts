"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import type { PlannerGroupDTO } from "@/actions/v2/get-course-groups-for-planner";
import { getPlannerCourseGroupsAction } from "@/actions/v2/get-course-groups-for-planner";
import { getRegistrationFacultyAction } from "@/actions/v2/get-registration-faculty";
import { getRegistrationRoundsAction } from "@/actions/v2/get-registration-rounds";
import type { RoundCourseDTO } from "@/actions/v2/get-round-courses";
import { getRegistrationRoundCoursesAction } from "@/actions/v2/get-round-courses";
import type { ScheduleParity } from "@/lib/utils/build-group-schedule-pattern";
import type {
  ClassType,
  ExtendedCourse,
  ExtendedGroup,
  Registration,
  WeekParity,
} from "@/types";
import { Day } from "@/types";

export class RegistrationUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationUnavailableError";
  }
}

const COURSE_FETCH_CONCURRENCY = 6;
const COURSES_STALE_TIME_MS = 60 * 1000;

/** ISO weekday (1 = Monday) → Day */
const WEEKDAY_TO_DAY: Day[] = [
  Day.MONDAY,
  Day.TUESDAY,
  Day.WEDNESDAY,
  Day.THURSDAY,
  Day.FRIDAY,
  Day.SATURDAY,
  Day.SUNDAY,
];

const PARITY_TO_WEEK: Record<ScheduleParity, WeekParity> = {
  all: "",
  even: "TP",
  odd: "TN",
  unknown: "",
};

const registrationCoursesQueryKey = (registrationId: string) =>
  ["registration-courses", registrationId] as const;

/** Runs `task` over `items` with at most `limit` tasks in flight, preserving order. */
async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = Array.from({ length: items.length });
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

/**
 * Builds the identifier stored in online plans. Kept index based for
 * compatibility with plans saved before this rewrite.
 */
const groupOnlineId = (courseId: string, index: number) =>
  `${courseId}_group_${index.toString()}`;

function toExtendedGroup(
  course: RoundCourseDTO,
  registrationId: string,
  group: PlannerGroupDTO,
  index: number,
): ExtendedGroup {
  const pattern = group.schedulePattern;
  const id = groupOnlineId(course.courseId, index);
  return {
    groupId: id,
    groupOnlineId: id,
    groupNumber: group.groupNumber,
    courseId: course.courseId,
    courseName: course.courseName,
    courseType: group.classtypeId as ClassType,
    registrationId,
    lecturer: group.lecturers
      .map((lecturer) => `${lecturer.firstName} ${lecturer.lastName}`)
      .join(", "),
    day: WEEKDAY_TO_DAY[(pattern?.weekday ?? 1) - 1] ?? Day.MONDAY,
    week: PARITY_TO_WEEK[pattern?.parity ?? "all"],
    startTime: pattern?.startTime ?? "07:30",
    endTime: pattern?.endTime ?? "09:00",
    spotsOccupied: group.spotsOccupied,
    spotsTotal: group.spotsTotal,
    averageRating: 0,
    opinionsCount: 0,
    isChecked: false,
    dates: pattern?.dates ?? [],
  };
}

async function fetchCourse(
  course: RoundCourseDTO,
  registrationId: string,
): Promise<ExtendedCourse> {
  const groups = await getPlannerCourseGroupsAction(
    course.courseId,
    course.termId,
  );
  return {
    id: course.courseId,
    name: course.courseName,
    registrationId,
    type: groups[0]?.classtypeId ?? "",
    isChecked: false,
    groups: groups.map((group, index) =>
      toExtendedGroup(course, registrationId, group, index),
    ),
  };
}

/** All courses of a registration with every course and group unchecked, sorted by name. */
async function fetchRegistrationCourses(
  registrationId: string,
): Promise<ExtendedCourse[]> {
  const rounds = await getRegistrationRoundsAction(registrationId);
  const nominalRound = rounds.at(0);
  if (nominalRound === undefined) {
    throw new RegistrationUnavailableError(
      "Ta rejestracja nie ma jeszcze żadnej tury zapisów w USOS.",
    );
  }

  const roundCourses = await getRegistrationRoundCoursesAction(nominalRound.id);
  if (roundCourses.length === 0) {
    throw new RegistrationUnavailableError(
      "Ta rejestracja nie ma jeszcze żadnych kursów w USOS.",
    );
  }
  const courses = await mapConcurrent(
    roundCourses,
    COURSE_FETCH_CONCURRENCY,
    async (course) => fetchCourse(course, registrationId),
  );

  return courses.toSorted((a, b) => a.name.localeCompare(b.name));
}

export async function fetchRegistrationDetails(
  registrationId: string,
): Promise<Registration> {
  const data = await getRegistrationFacultyAction(registrationId);
  return {
    id: registrationId,
    name: data.registrationDesc,
    departmentId: data.faculty.id,
  };
}

export function withSelection(
  courses: ExtendedCourse[],
  selection: {
    isCourseChecked: (course: ExtendedCourse) => boolean;
    isGroupChecked: (group: ExtendedGroup) => boolean;
  },
): ExtendedCourse[] {
  return courses.map((course) => ({
    ...course,
    isChecked: selection.isCourseChecked(course),
    groups: course.groups.map((group) => ({
      ...group,
      isChecked: selection.isGroupChecked(group),
    })),
  }));
}

/**
 * Cached course fetcher: concurrent callers for the same registration share
 * one request and results stay fresh for a minute.
 */
export function useRegistrationCoursesFetcher() {
  const queryClient = useQueryClient();
  return useCallback(
    async (registrationId: string) =>
      queryClient.query({
        queryKey: registrationCoursesQueryKey(registrationId),
        queryFn: async () => fetchRegistrationCourses(registrationId),
        staleTime: COURSES_STALE_TIME_MS,
      }),
    [queryClient],
  );
}

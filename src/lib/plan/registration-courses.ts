"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { getGroupSpotsAction } from "@/actions/v2/get-group-spots";
import type { ScheduleParity } from "@/lib/utils/build-group-schedule-pattern";
import type { ExtendedCourse, ExtendedGroup } from "@/types";

import { fetchRegistrationCourses } from "./build-registration-courses";

export {
  fetchRegistrationCourses,
  fetchRegistrationDetails,
  RegistrationUnavailableError,
} from "./build-registration-courses";

const PARITY_TO_WEEK: Record<ScheduleParity, ExtendedGroup["week"]> = {
  all: "",
  even: "TP",
  odd: "TN",
  unknown: "",
};

const COURSES_STALE_TIME_MS = 60 * 1000;

const registrationCoursesQueryKey = (registrationId: string) =>
  ["registration-courses", registrationId] as const;

export type GroupSpotsPatch = Pick<
  ExtendedGroup,
  "spotsOccupied" | "spotsTotal" | "week"
>;

const GROUP_SPOTS_CONCURRENCY = 8;

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
 * Live spot counts and week parity are scraped from the USOS group page and
 * are noticeably slower than the official API used to build the groups
 * themselves, so groups are shown instantly with placeholder spots/parity
 * and this fills them in afterwards. `onGroupReady` fires per group as its
 * data arrives instead of waiting for all of them.
 */
export async function refreshGroupSpots(
  groups: ExtendedGroup[],
  onGroupReady: (groupOnlineId: string, patch: GroupSpotsPatch) => void,
): Promise<void> {
  await mapConcurrent(groups, GROUP_SPOTS_CONCURRENCY, async (group) => {
    if (group.unitId === undefined) {
      return;
    }
    try {
      const spots = await getGroupSpotsAction(group.unitId, group.groupNumber);
      onGroupReady(group.groupOnlineId, {
        spotsOccupied: spots.spotsOccupied,
        spotsTotal: spots.spotsTotal,
        week: PARITY_TO_WEEK[spots.parity],
      });
    } catch {
      // Best effort: the group keeps its placeholder spots/parity.
    }
  });
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

"use server";

import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import {
  courseTimetableUrl,
  fetchUsosWebHtml,
  parseCourseTimetable,
} from "@/lib/usos-catalog";
import type {
  CatalogCourseTimetable,
  CatalogScrapedGroup,
} from "@/lib/usos-catalog";
import { CatalogCourseNotFoundError } from "@/lib/usos-catalog-error";
import { buildGroupSchedulePattern } from "@/lib/utils/build-group-schedule-pattern";
import type { ClassgroupDate } from "@/types";

import { getClassgroupDatesAction } from "./get-class-group-dates";

export async function getCatalogCourseAction(
  courseId: string,
  termId: string,
): Promise<CatalogCourseTimetable> {
  if (courseId.trim() === "" || termId.trim() === "") {
    throw new CatalogCourseNotFoundError(courseId);
  }

  return getOrSetRedis({
    redis,
    key: `usos:catalog_timetable:${courseId}:${termId}`,
    ttlSeconds: 60 * 15,
    fetcher: async () => {
      const { status, html } = await fetchUsosWebHtml(
        courseTimetableUrl(courseId, termId),
      );
      if (status >= 400) {
        throw new CatalogCourseNotFoundError(courseId);
      }
      const timetable = parseCourseTimetable(html, courseId, termId);
      const groups = await Promise.all(
        timetable.groups.map(async (group) => enrichGroupDates(group)),
      );
      return { ...timetable, groups };
    },
  });
}

async function enrichGroupDates(
  group: CatalogScrapedGroup,
): Promise<CatalogScrapedGroup> {
  try {
    const dates = await getClassgroupDatesAction(
      group.unitId,
      group.groupNumber,
    );
    const pattern = buildGroupSchedulePattern(
      dates.flatMap((entry): ClassgroupDate[] =>
        entry.startTime != null && entry.endTime != null
          ? [
              {
                date: entry.startTime.slice(0, 10),
                startTime: entry.startTime,
                endTime: entry.endTime,
              },
            ]
          : [],
      ),
    );
    if (pattern === null) {
      return group;
    }
    return {
      ...group,
      startTime: pattern.startTime,
      endTime: pattern.endTime,
      dates: pattern.dates,
    };
  } catch {
    return group;
  }
}

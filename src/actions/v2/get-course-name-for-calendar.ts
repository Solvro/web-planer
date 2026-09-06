"use server";

import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

export interface UsosCourse {
  id: string;
  name: {
    pl: string;
    en: string;
  };
}

export interface CalendarCourseDTO {
  id: string;
  name: string;
}

function normalizeLecturer(data: UsosCourse): CalendarCourseDTO {
  return {
    id: data.id,
    name: data.name.pl,
  };
}

export async function getCourseNameForCalendarAction(
  courseId: string,
): Promise<CalendarCourseDTO> {
  return getOrSetRedis({
    redis,
    key: `usos:course_calendar:${courseId}`,
    ttlSeconds: 60 * 60,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosCourse>("courses/course", {
        course_id: courseId,
        fields: "id|name",
      });

      return normalizeLecturer(data);
    },
  });
}

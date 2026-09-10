"use server";

import type { PlannerGroupDTO } from "@/actions/v2/get-course-groups-for-planner";
import { getPlannerCourseGroupsAction } from "@/actions/v2/get-course-groups-for-planner";
import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi, isUsosObjectNotFound } from "@/lib/usos";
import { CatalogCourseNotFoundError } from "@/lib/usos-catalog-error";

interface UsosLangDict {
  pl: string;
}

export interface CatalogCoursePayload {
  courseId: string;
  courseName: string;
  termId: string;
  termName: string;
  groups: PlannerGroupDTO[];
}

async function fetchCourseName(courseId: string): Promise<string> {
  const course = await fetchUsosApi<{ name: UsosLangDict }>("courses/course", {
    course_id: courseId,
    fields: "name",
  });
  return course.name.pl;
}

async function fetchTermName(termId: string): Promise<string> {
  const term = await fetchUsosApi<{ name: UsosLangDict }>("terms/term", {
    term_id: termId,
  });
  return term.name.pl;
}

export async function getCatalogCourseAction(
  courseId: string,
  termId: string,
): Promise<CatalogCoursePayload> {
  if (courseId.trim() === "" || termId.trim() === "") {
    throw new CatalogCourseNotFoundError(courseId);
  }

  return getOrSetRedis({
    redis,
    key: `usos:catalog_course_groups:v2:${courseId}:${termId}`,
    ttlSeconds: 60 * 15,
    fetcher: async () => {
      try {
        const [courseName, termName, groups] = await Promise.all([
          fetchCourseName(courseId),
          fetchTermName(termId),
          getPlannerCourseGroupsAction(courseId, termId),
        ]);
        return {
          courseId,
          courseName,
          termId,
          termName,
          groups,
        };
      } catch (error) {
        if (isUsosObjectNotFound(error)) {
          throw new CatalogCourseNotFoundError(courseId);
        }
        throw error;
      }
    },
  });
}

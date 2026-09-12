"use server";

import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi, isUsosObjectNotFound } from "@/lib/usos";
import { catalogTermStatus, normalizeCourseCode } from "@/lib/usos-catalog";
import type { CatalogCourseLookup } from "@/lib/usos-catalog";
import { CatalogCourseNotFoundError } from "@/lib/usos-catalog-error";

interface UsosLangDict {
  pl: string;
}

interface UsosCourse {
  id: string;
  name: UsosLangDict;
  terms: { id: string }[];
}

interface UsosTerm {
  id: string;
  name: UsosLangDict;
  start_date: string;
  finish_date: string;
}

async function fetchCourseLookup(
  courseId: string,
): Promise<CatalogCourseLookup> {
  let course: UsosCourse;
  try {
    course = await fetchUsosApi<UsosCourse>("courses/course", {
      course_id: courseId,
      fields: "id|name|terms",
    });
  } catch (error) {
    if (isUsosObjectNotFound(error)) {
      throw new CatalogCourseNotFoundError(courseId);
    }
    throw error;
  }

  const termIds = course.terms.map((term) => term.id);
  if (termIds.length === 0) {
    return { courseId: course.id, name: course.name.pl, terms: [] };
  }

  const terms = await fetchUsosApi<Record<string, UsosTerm | null>>(
    "terms/terms",
    { term_ids: termIds.join("|") },
  );

  return {
    courseId: course.id,
    name: course.name.pl,
    terms: termIds.flatMap((termId) => {
      const term = terms[termId];
      if (term === null) {
        return [];
      }
      return [
        {
          termId: term.id,
          name: term.name.pl,
          status: catalogTermStatus(term.start_date, term.finish_date),
        },
      ];
    }),
  };
}

export async function lookupCourseByCodeAction(
  rawCode: string,
): Promise<CatalogCourseLookup> {
  const courseId = normalizeCourseCode(rawCode);
  if (courseId === "") {
    throw new CatalogCourseNotFoundError(rawCode);
  }

  return getOrSetRedis({
    redis,
    key: `usos:catalog_course:v2:${courseId}`,
    ttlSeconds: 60 * 60,
    fetcher: async () => fetchCourseLookup(courseId),
  });
}

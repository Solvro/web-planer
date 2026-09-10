"use server";

import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import {
  coursePageUrl,
  fetchUsosWebHtml,
  normalizeCourseCode,
  parseCourseLookup,
} from "@/lib/usos-catalog";
import type { CatalogCourseLookup } from "@/lib/usos-catalog";
import { CatalogCourseNotFoundError } from "@/lib/usos-catalog-error";

export async function lookupCourseByCodeAction(
  rawCode: string,
): Promise<CatalogCourseLookup> {
  const courseId = normalizeCourseCode(rawCode);
  if (courseId === "") {
    throw new CatalogCourseNotFoundError(rawCode);
  }

  return getOrSetRedis({
    redis,
    key: `usos:catalog_course:${courseId}`,
    ttlSeconds: 60 * 60,
    fetcher: async () => {
      const { status, html } = await fetchUsosWebHtml(coursePageUrl(courseId));
      if (status >= 400) {
        throw new CatalogCourseNotFoundError(courseId);
      }
      return parseCourseLookup(html, courseId);
    },
  });
}

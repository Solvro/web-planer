import type { CatalogCoursePayload } from "@/actions/v2/get-catalog-course";
import { plannerGroupToExtendedGroup } from "@/lib/plan/build-registration-courses";
import type {
  CatalogCourseLookup,
  CatalogCourseTerm,
} from "@/lib/usos-catalog";
import { CatalogCourseNotFoundError } from "@/lib/usos-catalog-error";
import type { ExtendedCourse, Registration } from "@/types";

export { CatalogCourseNotFoundError } from "@/lib/usos-catalog-error";
export type { CatalogCourseLookup } from "@/lib/usos-catalog";

export const CATALOG_REGISTRATION_PREFIX = "katalog::";

export function catalogRegistrationId(
  courseId: string,
  termId: string,
): string {
  return `${CATALOG_REGISTRATION_PREFIX}${courseId}::${termId}`;
}

export function parseCatalogRegistrationId(
  registrationId: string,
): { courseId: string; termId: string } | null {
  if (!registrationId.startsWith(CATALOG_REGISTRATION_PREFIX)) {
    return null;
  }
  const rest = registrationId.slice(CATALOG_REGISTRATION_PREFIX.length);
  const separator = rest.lastIndexOf("::");
  if (separator <= 0) {
    return null;
  }
  const courseId = rest.slice(0, separator);
  const termId = rest.slice(separator + 2);
  if (courseId === "" || termId === "") {
    return null;
  }
  return { courseId, termId };
}

function termChronology(termId: string): number {
  const match = /^(\d{4})\/(\d{2})-([ZL])/i.exec(termId);
  if (match === null) {
    return 0;
  }
  const startYear = Number.parseInt(match[1], 10);
  const season = match[3].toUpperCase() === "L" ? 1 : 0;
  return startYear * 2 + season;
}

function termStatusRank(status: string | null): number {
  if (status === null || status === "") {
    return 1;
  }
  if (status.includes("zakończony")) {
    return 2;
  }
  if (status.includes("nie rozpoczęty")) {
    return 0;
  }
  return 1;
}

export function sortCatalogTerms(
  terms: CatalogCourseTerm[],
): CatalogCourseTerm[] {
  return terms.toSorted((left, right) => {
    const statusDelta =
      termStatusRank(left.status) - termStatusRank(right.status);
    if (statusDelta !== 0) {
      return statusDelta;
    }
    const chronologyDelta =
      termChronology(left.termId) - termChronology(right.termId);
    // Prefer the soonest upcoming term, otherwise the newest current/finished one.
    return termStatusRank(left.status) === 0
      ? chronologyDelta
      : -chronologyDelta;
  });
}

export function preferredCatalogTermId(
  terms: CatalogCourseTerm[],
): string | null {
  return sortCatalogTerms(terms).at(0)?.termId ?? null;
}

export function toCatalogExtendedCourse(payload: CatalogCoursePayload): {
  registration: Registration;
  course: ExtendedCourse;
} {
  const registrationId = catalogRegistrationId(
    payload.courseId,
    payload.termId,
  );
  const courseRef = {
    courseId: payload.courseId,
    courseName: payload.courseName,
  };
  const groups = payload.groups.map((group, index) =>
    plannerGroupToExtendedGroup(
      courseRef,
      registrationId,
      group,
      index,
      registrationId,
    ),
  );

  return {
    registration: {
      id: registrationId,
      name: payload.courseName,
      departmentId: payload.termName,
    },
    course: {
      id: registrationId,
      name: payload.courseName,
      registrationId,
      type: groups[0]?.courseType ?? "",
      isChecked: true,
      groups,
    },
  };
}

export async function lookupCatalogCourse(
  rawCode: string,
): Promise<CatalogCourseLookup> {
  const { lookupCourseByCodeAction } =
    await import("@/actions/v2/lookup-course-by-code");
  try {
    return await lookupCourseByCodeAction(rawCode);
  } catch (error) {
    if (error instanceof CatalogCourseNotFoundError) {
      throw error;
    }
    if (error instanceof Error && error.message.includes("Nie znaleziono")) {
      throw new CatalogCourseNotFoundError(rawCode);
    }
    throw error;
  }
}

export async function fetchCatalogCourse(
  courseId: string,
  termId: string,
): Promise<{ registration: Registration; course: ExtendedCourse }> {
  const { getCatalogCourseAction } =
    await import("@/actions/v2/get-catalog-course");
  const payload = await getCatalogCourseAction(courseId, termId);
  return toCatalogExtendedCourse(payload);
}

export async function fetchCatalogRegistration(
  registrationId: string,
): Promise<{ registration: Registration; courses: ExtendedCourse[] } | null> {
  const parsed = parseCatalogRegistrationId(registrationId);
  if (parsed === null) {
    return null;
  }
  const { registration, course } = await fetchCatalogCourse(
    parsed.courseId,
    parsed.termId,
  );
  return { registration, courses: [course] };
}

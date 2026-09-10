import type {
  CatalogCourseLookup,
  CatalogCourseTerm,
  CatalogCourseTimetable,
} from "@/lib/usos-catalog";
import { CatalogCourseNotFoundError } from "@/lib/usos-catalog-error";
import type { ExtendedCourse, ExtendedGroup, Registration } from "@/types";

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
    return termChronology(right.termId) - termChronology(left.termId);
  });
}

export function preferredCatalogTermId(
  terms: CatalogCourseTerm[],
): string | null {
  return sortCatalogTerms(terms).at(0)?.termId ?? null;
}

const groupOnlineId = (courseKey: string, index: number) =>
  `${courseKey}_group_${index.toString()}`;

export function toCatalogExtendedCourse(timetable: CatalogCourseTimetable): {
  registration: Registration;
  course: ExtendedCourse;
} {
  const registrationId = catalogRegistrationId(
    timetable.courseId,
    timetable.termId,
  );
  const courseKey = registrationId;
  const groups: ExtendedGroup[] = timetable.groups.map((group, index) => {
    const id = groupOnlineId(courseKey, index);
    return {
      groupId: id,
      groupOnlineId: id,
      groupNumber: group.groupNumber,
      courseId: timetable.courseId,
      courseName: timetable.courseName,
      courseType: group.classtypeId,
      registrationId,
      lecturer: group.lecturer,
      day: group.day,
      week: group.week,
      startTime: group.startTime,
      endTime: group.endTime,
      spotsOccupied: 0,
      spotsTotal: 0,
      averageRating: 0,
      opinionsCount: 0,
      isChecked: false,
      dates: group.dates,
      unitId: group.unitId,
    };
  });

  return {
    registration: {
      id: registrationId,
      name: timetable.courseName,
      departmentId: timetable.termName,
    },
    course: {
      id: courseKey,
      name: timetable.courseName,
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
  const timetable = await getCatalogCourseAction(courseId, termId);
  return toCatalogExtendedCourse(timetable);
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

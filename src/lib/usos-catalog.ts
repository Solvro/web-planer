export interface CatalogCourseTerm {
  termId: string;
  name: string;
  status: string | null;
}

export interface CatalogCourseLookup {
  courseId: string;
  name: string;
  terms: CatalogCourseTerm[];
}

/** Accepts a raw code or a USOSweb course URL and returns the course code. */
export function normalizeCourseCode(input: string): string {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("prz_kod");
    if (fromQuery !== null && fromQuery.trim() !== "") {
      return fromQuery.trim();
    }
  } catch {
    // Not a URL — treat the whole string as a course code.
  }
  return trimmed;
}

export function catalogTermStatus(
  startDate: string,
  finishDate: string,
  today = new Date(),
): string | null {
  const todayStamp = [
    today.getFullYear().toString(),
    (today.getMonth() + 1).toString().padStart(2, "0"),
    today.getDate().toString().padStart(2, "0"),
  ].join("-");
  if (todayStamp > finishDate) {
    return "zakończony";
  }
  if (todayStamp < startDate) {
    return "nie rozpoczęty";
  }
  return null;
}

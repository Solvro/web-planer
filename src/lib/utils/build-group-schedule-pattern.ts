import type { ClassgroupDate } from "@/types";

export type SchedulePattern =
  "weekly" | "biweekly" | "weekly_with_exceptions" | "irregular";

export type ScheduleParity = "even" | "odd" | "all" | "unknown";

export interface GroupSchedulePattern {
  pattern: SchedulePattern;
  parity: ScheduleParity;
  /** ISO weekday: 1 = Monday … 7 = Sunday */
  weekday: number;
  /** "HH:MM" */
  startTime: string;
  /** "HH:MM" */
  endTime: string;
  /** "YYYY-MM-DD" */
  firstOccurrence: string;
  /** "YYYY-MM-DD" */
  lastOccurrence: string;
  occurrencesCount: number;
  /** Weekly slots that were skipped ("YYYY-MM-DD"), only for weekly_with_exceptions. */
  exceptions: string[];
  /** Every real meeting date, sorted ascending ("YYYY-MM-DD"). */
  dates: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKLY_GAP = 7;
const BIWEEKLY_GAP = 14;
const GAP_TOLERANCE = 2;
const WEEKLY_SHARE_THRESHOLD = 0.7;

/** Parses "YYYY-MM-DD" as UTC midnight so the result never depends on the server timezone. */
function parseIsoDate(date: string): Date {
  return new Date(`${date.slice(0, 10)}T00:00:00Z`);
}

export function isoWeekday(date: string): number {
  return parseIsoDate(date).getUTCDay() || 7;
}

export function daysBetween(from: string, to: string): number {
  return Math.round(
    (parseIsoDate(to).getTime() - parseIsoDate(from).getTime()) / DAY_MS,
  );
}

function addDays(date: string, days: number): string {
  const result = parseIsoDate(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function isoWeekNumber(date: string): number {
  const d = parseIsoDate(date);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart) / DAY_MS + 1) / 7);
}

export function mostFrequent<T>(values: T[]): T | undefined {
  const counts = new Map<T, number>();
  let best: T | undefined;
  let bestCount = 0;
  for (const value of values) {
    const count = (counts.get(value) ?? 0) + 1;
    counts.set(value, count);
    if (count > bestCount) {
      bestCount = count;
      best = value;
    }
  }
  return best;
}

/** "YYYY-MM-DD HH:MM:SS" (or any string with a time part) → "HH:MM" */
function extractClock(dateTime: string): string | null {
  const match = /(\d{1,2}):(\d{2})/.exec(dateTime.slice(10));
  if (match === null) {
    return null;
  }
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function isNear(gap: number, target: number): boolean {
  return Math.abs(gap - target) <= GAP_TOLERANCE;
}

function collectSkippedWeeks(sorted: string[], gaps: number[]): string[] {
  const skipped: string[] = [];
  for (const [index, gap] of gaps.entries()) {
    if (isNear(gap, WEEKLY_GAP)) {
      continue;
    }
    let cursor = sorted[index];
    let remaining = gap;
    while (remaining > WEEKLY_GAP + GAP_TOLERANCE) {
      cursor = addDays(cursor, WEEKLY_GAP);
      skipped.push(cursor);
      remaining -= WEEKLY_GAP;
    }
  }
  return skipped;
}

export function buildGroupSchedulePattern(
  entries: ClassgroupDate[],
): GroupSchedulePattern | null {
  if (entries.length === 0) {
    return null;
  }

  const dates = [...new Set(entries.map((entry) => entry.date))].toSorted();
  const startTime =
    mostFrequent(
      entries.flatMap((entry) => extractClock(entry.startTime) ?? []),
    ) ?? "07:30";
  const endTime =
    mostFrequent(
      entries.flatMap((entry) => extractClock(entry.endTime) ?? []),
    ) ?? "09:00";
  const weekday = mostFrequent(dates.map((date) => isoWeekday(date))) ?? 1;

  const base = {
    weekday,
    startTime,
    endTime,
    firstOccurrence: dates[0],
    lastOccurrence: dates.at(-1) ?? dates[0],
    occurrencesCount: dates.length,
    dates,
  };

  if (dates.length === 1) {
    return { ...base, pattern: "irregular", parity: "unknown", exceptions: [] };
  }

  const gaps = dates
    .slice(1)
    .map((date, index) => daysBetween(dates[index], date));
  const typicalGap = mostFrequent(gaps);

  if (typicalGap === WEEKLY_GAP) {
    return { ...base, pattern: "weekly", parity: "all", exceptions: [] };
  }

  if (typicalGap === BIWEEKLY_GAP) {
    // Fallback parity (ISO week of the first meeting). The planner action
    // overrides it with the parity relative to the term start.
    return {
      ...base,
      pattern: "biweekly",
      parity: isoWeekNumber(dates[0]) % 2 === 0 ? "even" : "odd",
      exceptions: [],
    };
  }

  const weeklyShare =
    gaps.filter((gap) => isNear(gap, WEEKLY_GAP)).length / gaps.length;

  if (weeklyShare >= WEEKLY_SHARE_THRESHOLD) {
    return {
      ...base,
      pattern: "weekly_with_exceptions",
      parity: "all",
      exceptions: collectSkippedWeeks(dates, gaps),
    };
  }

  return { ...base, pattern: "irregular", parity: "unknown", exceptions: [] };
}

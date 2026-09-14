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
  meetings: ScheduleMeetingPattern[];
}

export interface ScheduleMeetingPattern {
  weekday: number;
  startTime: string;
  endTime: string;
  dates: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKLY_GAP = 7;
const BIWEEKLY_GAP = 14;
const GAP_TOLERANCE = 2;
const WEEKLY_SHARE_THRESHOLD = 0.7;
const SECOND_SLOT_SHARE_THRESHOLD = 0.6;

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

function groupEntries(
  entries: ClassgroupDate[],
): Map<string, ClassgroupDate[]> {
  const grouped = new Map<string, ClassgroupDate[]>();
  for (const entry of entries) {
    const startTime = extractClock(entry.startTime) ?? "07:30";
    const endTime = extractClock(entry.endTime) ?? "09:00";
    const key = `${isoWeekday(entry.date).toString()}|${startTime}|${endTime}`;
    const current = grouped.get(key) ?? [];
    current.push(entry);
    grouped.set(key, current);
  }
  return grouped;
}

function selectDominantSlots(
  grouped: Map<string, ClassgroupDate[]>,
): [string, ClassgroupDate[]][] {
  const slots = [...grouped.entries()].toSorted(
    ([, first], [, second]) => second.length - first.length,
  );
  const primary = slots[0];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (primary === undefined) {
    return [];
  }

  const secondary = slots[1];
  if (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    secondary !== undefined &&
    secondary[1].length >= primary[1].length * SECOND_SLOT_SHARE_THRESHOLD &&
    (primary[1].length + secondary[1].length) /
      slots.reduce((total, [, entries]) => total + entries.length, 0) >=
      WEEKLY_SHARE_THRESHOLD
  ) {
    return [primary, secondary];
  }

  return [primary];
}

export function buildGroupSchedulePattern(
  entries: ClassgroupDate[],
): GroupSchedulePattern | null {
  if (entries.length === 0) {
    return null;
  }

  // Keep the old dominant-slot behaviour: moved or exceptional meetings do
  // not become cards. A second slot is retained only for genuinely recurring
  // twice-weekly groups.
  const meetings = selectDominantSlots(groupEntries(entries))
    .map(([key, meetingEntries]) => {
      const [weekdayText, startTime, endTime] = key.split("|");
      return {
        weekday: Number(weekdayText),
        startTime,
        endTime,
        dates: [
          ...new Set(meetingEntries.map((entry) => entry.date)),
        ].toSorted(),
      };
    })
    .toSorted(
      (a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime),
    );
  const primaryMeeting = meetings[0];
  const dates = [...new Set(entries.map((entry) => entry.date))].toSorted();
  const startTime = primaryMeeting.startTime;
  const endTime = primaryMeeting.endTime;
  const weekday = primaryMeeting.weekday;

  const base = {
    weekday,
    startTime,
    endTime,
    firstOccurrence: dates[0],
    lastOccurrence: dates.at(-1) ?? dates[0],
    occurrencesCount: dates.length,
    dates,
    meetings,
  };

  if (dates.length === 1) {
    return { ...base, pattern: "irregular", parity: "unknown", exceptions: [] };
  }

  const meetingGaps = meetings.map((meeting) =>
    meeting.dates
      .slice(1)
      .map((date, index) => daysBetween(meeting.dates[index], date)),
  );
  const gaps = meetingGaps.flat();
  const allWeekly = meetingGaps.every(
    (meeting) =>
      meeting.length > 0 && meeting.every((gap) => isNear(gap, WEEKLY_GAP)),
  );
  const allBiweekly = meetingGaps.every(
    (meeting) =>
      meeting.length > 0 && meeting.every((gap) => isNear(gap, BIWEEKLY_GAP)),
  );

  if (allWeekly) {
    return { ...base, pattern: "weekly", parity: "all", exceptions: [] };
  }

  if (allBiweekly) {
    // Parity is filled in by the caller from the scraped group page.
    return {
      ...base,
      pattern: "biweekly",
      parity: "unknown",
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
      exceptions: meetings.flatMap((meeting) =>
        collectSkippedWeeks(
          meeting.dates,
          meeting.dates
            .slice(1)
            .map((date, index) => daysBetween(meeting.dates[index], date)),
        ),
      ),
    };
  }

  return { ...base, pattern: "irregular", parity: "unknown", exceptions: [] };
}

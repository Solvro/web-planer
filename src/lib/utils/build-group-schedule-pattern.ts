import type { ClassgroupDate } from "@/types";

export type SchedulePattern =
  "weekly" | "biweekly" | "weekly_with_exceptions" | "irregular";

export type ScheduleParity = "even" | "odd" | "all" | "unknown";

export interface GroupSchedulePattern {
  pattern: SchedulePattern;
  parity: ScheduleParity;
  weekday: number;
  startTime: string;
  endTime: string;
  firstOccurrence: string;
  lastOccurrence: string;
  occurrencesCount: number;
  exceptions: string[];
}

const WEEKLY_GAP = 7;
const GAP_TOLERANCE = 2;

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function isNear(gap: number, target: number): boolean {
  return Math.abs(gap - target) <= GAP_TOLERANCE;
}

function isoWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

function isoWeekday(date: Date): number {
  return date.getDay() || 7;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function getGapsMode(numbers: number[]): number[] {
  if (numbers.length === 0) {
    return [];
  }

  const frequencyMap: Record<number, number> = {};
  let maxFreq = 0;

  for (const gap of numbers) {
    frequencyMap[gap] = (frequencyMap[gap] || 0) + 1;
    if (frequencyMap[gap] > maxFreq) {
      maxFreq = frequencyMap[gap];
    }
  }

  const modes: number[] = [];

  for (const key in frequencyMap) {
    if (frequencyMap[key] === maxFreq) {
      modes.push(Number(key));
    }
  }

  return modes;
}

function getHoursMode(hours: string[]): string {
  const frequencyMap: Record<string, number> = {};
  let maxCount = 0;
  let mode = hours[0];

  for (const item of hours) {
    frequencyMap[item] = (frequencyMap[item] || 0) + 1;

    if (frequencyMap[item] > maxCount) {
      maxCount = frequencyMap[item];
      mode = item;
    }
  }

  return mode;
}

export function getMostFrequentTimes(entries: ClassgroupDate[]): {
  startTime: string;
  endTime: string;
} {
  const startTimes: string[] = [];
  const endTimes: string[] = [];

  for (const entry of entries) {
    const startTimePart = entry.startTime.split(" ")[1];
    const endTimePart = entry.endTime.split(" ")[1];

    if (startTimePart) {
      startTimes.push(startTimePart);
    }
    if (endTimePart) {
      endTimes.push(endTimePart);
    }
  }

  const modeStartTime = getHoursMode(startTimes);
  const modeEndTime = getHoursMode(endTimes);

  const baseDate = entries[0].date;

  return {
    startTime: `${baseDate} ${modeStartTime}`,
    endTime: `${baseDate} ${modeEndTime}`,
  };
}

export function buildGroupSchedulePattern(
  dates: ClassgroupDate[],
): GroupSchedulePattern | null {
  if (dates.length === 0) {
    return null;
  }

  const sorted = [...dates].toSorted((a, b) => a.date.localeCompare(b.date));
  const firstDate = new Date(sorted[0].date);
  const firstEntry = sorted[0];
  const lastEntry = sorted.at(-1) ?? firstEntry;

  const { startTime, endTime } = getMostFrequentTimes(dates);

  if (sorted.length === 1) {
    return {
      pattern: "irregular",
      parity: "unknown",
      weekday: isoWeekday(firstDate),
      startTime,
      endTime,
      firstOccurrence: firstEntry.date,
      lastOccurrence: lastEntry.date,
      occurrencesCount: 1,
      exceptions: [],
    };
  }

  const gaps = sorted
    .slice(1)
    .map((entry, index) => daysBetween(sorted[index].date, entry.date));

  const weeklyGaps = gaps.filter((g) => isNear(g, WEEKLY_GAP));
  const total = gaps.length;

  let pattern: SchedulePattern;
  let parity: ScheduleParity;
  let exceptions: string[] = [];

  const allWeekly = getGapsMode(gaps).includes(7);
  const allBiweekly = getGapsMode(gaps).includes(14);

  if (allWeekly) {
    pattern = "weekly";
    parity = "all";
  } else if (allBiweekly) {
    pattern = "biweekly";
    const weekNumber = isoWeekNumber(firstDate);
    parity = weekNumber % 2 === 0 ? "even" : "odd";
  } else if (weeklyGaps.length / total >= 0.7) {
    pattern = "weekly_with_exceptions";
    parity = "all";
    exceptions = gaps.flatMap((gap, index) => {
      if (!isNear(gap, WEEKLY_GAP)) {
        const skipped: string[] = [];
        let cursor = sorted[index].date;
        let remaining = gap;
        while (remaining > WEEKLY_GAP + GAP_TOLERANCE) {
          cursor = addDays(cursor, WEEKLY_GAP);
          skipped.push(cursor);
          remaining -= WEEKLY_GAP;
        }
        return skipped;
      }
      return [];
    });
  } else {
    pattern = "irregular";
    parity = "unknown";
  }

  return {
    pattern,
    parity,
    weekday: isoWeekday(firstDate),
    startTime,
    endTime,
    firstOccurrence: firstEntry.date,
    lastOccurrence: lastEntry.date,
    occurrencesCount: sorted.length,
    exceptions,
  };
}

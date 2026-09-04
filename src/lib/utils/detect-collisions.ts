import { parseTimeToMinutes } from "@/components/schedule/time-scale";
import type { Day, ExtendedGroup } from "@/types";

export interface Collision {
  day: Day;
  groups: [ExtendedGroup, ExtendedGroup];
  startMinutes: number;
  endMinutes: number;
}

function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) {
  return aStart < bEnd && bStart < aEnd;
}

function weeksOverlap(a: ExtendedGroup["week"], b: ExtendedGroup["week"]) {
  if (a === "" || b === "" || a === "!" || b === "!") {
    return true;
  }
  return a === b;
}

/**
 * `week` (TN/TP) comes from scraping the group page and can stay "" (unknown)
 * even for a genuinely biweekly group. Actual meeting dates come straight
 * from the official schedule API, so when both groups have them, trust
 * those instead: no shared date means no real collision even if `week`
 * hasn't resolved yet.
 */
function datesOverlap(
  a: string[] | undefined,
  b: string[] | undefined,
): boolean | undefined {
  if (a === undefined || b === undefined || a.length === 0 || b.length === 0) {
    return undefined;
  }
  const bDates = new Set(b);
  return a.some((date) => bDates.has(date));
}

export function detectCollisions(groups: ExtendedGroup[]): Collision[] {
  const byDay = new Map<Day, ExtendedGroup[]>();
  for (const group of groups) {
    const list = byDay.get(group.day) ?? [];
    list.push(group);
    byDay.set(group.day, list);
  }

  const collisions: Collision[] = [];

  for (const [day, dayGroups] of byDay) {
    for (let first = 0; first < dayGroups.length; first++) {
      for (let second = first + 1; second < dayGroups.length; second++) {
        const a = dayGroups[first];
        const b = dayGroups[second];
        if (a.courseId === b.courseId && a.groupId === b.groupId) {
          continue;
        }

        const aStart = parseTimeToMinutes(a.startTime);
        const aEnd = parseTimeToMinutes(a.endTime);
        const bStart = parseTimeToMinutes(b.startTime);
        const bEnd = parseTimeToMinutes(b.endTime);

        if (!rangesOverlap(aStart, aEnd, bStart, bEnd)) {
          continue;
        }
        const sharedDate = datesOverlap(a.dates, b.dates);
        const overlaps = sharedDate ?? weeksOverlap(a.week, b.week);
        if (!overlaps) {
          continue;
        }

        collisions.push({
          day,
          groups: [a, b],
          startMinutes: Math.max(aStart, bStart),
          endMinutes: Math.min(aEnd, bEnd),
        });
      }
    }
  }

  return collisions;
}

export function collidingGroupIds(collisions: Collision[]): Set<string> {
  const ids = new Set<string>();
  for (const collision of collisions) {
    for (const group of collision.groups) {
      ids.add(group.groupId);
    }
  }
  return ids;
}

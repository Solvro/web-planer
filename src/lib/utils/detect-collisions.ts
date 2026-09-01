import type { ExtendedGroup } from "@/atoms/plan-family";
import { parseTimeToMinutes } from "@/components/schedule/time-scale";
import type { Day } from "@/types";

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
        if (!weeksOverlap(a.week, b.week)) {
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

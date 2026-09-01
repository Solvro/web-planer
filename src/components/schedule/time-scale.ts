import type { ScheduleDensity } from "@/atoms/schedule-density";

export const DENSITY_MINUTE_HEIGHT: Record<ScheduleDensity, number> = {
  compact: 0.8,
  standard: 1.1,
  relaxed: 1.5,
};

export const DENSITY_MINUTE_WIDTH: Record<ScheduleDensity, number> = {
  compact: 1.9,
  standard: 2.5,
  relaxed: 3.2,
};

export const DENSITY_ROW_HEIGHT: Record<ScheduleDensity, number> = {
  compact: 84,
  standard: 100,
  relaxed: 118,
};

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
}

export function getDayTimeRange(
  groups: { startTime: string; endTime: string }[],
): {
  startMinutes: number;
  endMinutes: number;
} {
  if (groups.length === 0) {
    return { startMinutes: 8 * 60, endMinutes: 18 * 60 };
  }

  const starts = groups.map((group) => parseTimeToMinutes(group.startTime));
  const ends = groups.map((group) => parseTimeToMinutes(group.endTime));

  const paddedStart = Math.min(...starts) - 30;
  const paddedEnd = Math.max(...ends) + 30;

  return {
    startMinutes: Math.max(0, Math.floor(paddedStart / 60) * 60),
    endMinutes: Math.min(24 * 60, Math.ceil(paddedEnd / 60) * 60),
  };
}

export function buildHourMarks(
  startMinutes: number,
  endMinutes: number,
): number[] {
  const marks: number[] = [];
  for (
    let minute = Math.ceil(startMinutes / 60) * 60;
    minute <= endMinutes;
    minute += 60
  ) {
    marks.push(minute);
  }
  return marks;
}

export function buildStartTimeMarks(
  groups: { startTime: string }[],
  hourMarks: number[],
): number[] {
  const marks = new Set<number>();

  for (const group of groups) {
    const minute = parseTimeToMinutes(group.startTime);
    const closeToHour = hourMarks.some((hour) => Math.abs(hour - minute) < 10);
    if (!closeToHour) {
      marks.add(minute);
    }
  }

  return [...marks].toSorted((a, b) => a - b);
}

export interface LayoutBlock<T> {
  item: T;
  start: number;
  end: number;
  column: number;
  columns: number;
}

export function layoutOverlaps<T>(
  items: T[],
  getRange: (item: T) => { start: number; end: number },
): LayoutBlock<T>[] {
  const withRange = items
    .map((item) => ({ item, ...getRange(item) }))
    .toSorted((a, b) => a.start - b.start || a.end - b.end);

  const clusters: (typeof withRange)[] = [];
  let currentCluster: typeof withRange = [];
  let clusterEnd = Number.NEGATIVE_INFINITY;

  for (const block of withRange) {
    if (currentCluster.length > 0 && block.start >= clusterEnd) {
      clusters.push(currentCluster);
      currentCluster = [];
      clusterEnd = Number.NEGATIVE_INFINITY;
    }
    currentCluster.push(block);
    clusterEnd = Math.max(clusterEnd, block.end);
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  const result: LayoutBlock<T>[] = [];

  for (const cluster of clusters) {
    const columnEnds: number[] = [];
    const columnOf = new Map<(typeof cluster)[number], number>();

    for (const block of cluster) {
      let column = columnEnds.findIndex((end) => end <= block.start);
      if (column === -1) {
        column = columnEnds.length;
        columnEnds.push(block.end);
      } else {
        columnEnds[column] = block.end;
      }
      columnOf.set(block, column);
    }

    const columns = columnEnds.length;
    for (const block of cluster) {
      result.push({
        item: block.item,
        start: block.start,
        end: block.end,
        column: columnOf.get(block) ?? 0,
        columns,
      });
    }
  }

  return result;
}

"use client";

import { useMemo } from "react";

import { ALL_DAYS, DAYS, WEEKEND_DAYS } from "@/constants/days";
import { useScheduleDensity } from "@/hooks/use-schedule-density";
import { useScheduleOrientation } from "@/hooks/use-schedule-orientation";
import type { Collision } from "@/lib/utils/detect-collisions";
import type { Day, ExtendedGroup } from "@/types";

import { DayColumn } from "./day-column";
import { DayRow } from "./day-row";
import type { ScheduleViewProps } from "./schedule-board";
import {
  DENSITY_MINUTE_HEIGHT,
  DENSITY_MINUTE_WIDTH,
  DENSITY_ROW_HEIGHT,
  buildHourMarks,
  buildStartTimeMarks,
  formatMinutes,
  getDayTimeRange,
} from "./time-scale";

export function groupByDay<T extends { day: Day }>(items: T[]): Map<Day, T[]> {
  const byDay = new Map<Day, T[]>();
  for (const item of items) {
    const list = byDay.get(item.day);
    if (list === undefined) {
      byDay.set(item.day, [item]);
    } else {
      list.push(item);
    }
  }
  return byDay;
}

const EMPTY_GROUPS: ExtendedGroup[] = [];
const EMPTY_COLLISIONS: Collision[] = [];

export function WeekGrid({
  allGroups,
  selectedGroups,
  collisions,
  onSelectGroup,
  isReadonly = false,
  onlyDaysWithGroups = false,
}: ScheduleViewProps & { onlyDaysWithGroups?: boolean }) {
  const { density } = useScheduleDensity();
  const { orientation } = useScheduleOrientation();

  const groupsByDay = useMemo(() => groupByDay(allGroups), [allGroups]);
  const collisionsByDay = useMemo(() => groupByDay(collisions), [collisions]);

  const visibleDays = useMemo(() => {
    if (onlyDaysWithGroups) {
      return ALL_DAYS.filter((d) => groupsByDay.has(d.day));
    }
    return [...DAYS, ...WEEKEND_DAYS.filter((d) => groupsByDay.has(d.day))];
  }, [groupsByDay, onlyDaysWithGroups]);

  const { startMinutes, endMinutes } = useMemo(
    () => getDayTimeRange(allGroups),
    [allGroups],
  );
  const hourMarks = useMemo(
    () => buildHourMarks(startMinutes, endMinutes),
    [startMinutes, endMinutes],
  );

  if (orientation === "horizontal") {
    const minuteWidth = DENSITY_MINUTE_WIDTH[density];
    const rowHeight = DENSITY_ROW_HEIGHT[density];
    const startTimeMarks = buildStartTimeMarks(allGroups, hourMarks);

    return (
      <div className="divide-border/60 flex flex-col divide-y overflow-x-auto">
        {visibleDays.map(({ day, label }) => (
          <div key={day} className="py-4 first:pt-0 last:pb-0">
            <DayRow
              label={label}
              groups={groupsByDay.get(day) ?? EMPTY_GROUPS}
              selectedGroups={selectedGroups}
              collisions={collisionsByDay.get(day) ?? EMPTY_COLLISIONS}
              onSelectGroup={onSelectGroup}
              isReadonly={isReadonly}
              startMinutes={startMinutes}
              endMinutes={endMinutes}
              minuteWidth={minuteWidth}
              rowHeight={rowHeight}
              hourMarks={hourMarks}
              startTimeMarks={startTimeMarks}
            />
          </div>
        ))}
      </div>
    );
  }

  const minuteHeight = DENSITY_MINUTE_HEIGHT[density];
  const totalHeight = Math.max((endMinutes - startMinutes) * minuteHeight, 120);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      <div className="w-14 shrink-0">
        <div className="h-10" />
        <div className="relative" style={{ height: totalHeight }}>
          {hourMarks.map((minute) => (
            <span
              key={minute}
              style={{ top: (minute - startMinutes) * minuteHeight }}
              className="text-muted-foreground absolute -translate-y-1/2 text-xs"
            >
              {formatMinutes(minute)}
            </span>
          ))}
        </div>
      </div>
      {visibleDays.map(({ day, label }) => (
        <DayColumn
          key={day}
          label={label}
          groups={groupsByDay.get(day) ?? EMPTY_GROUPS}
          selectedGroups={selectedGroups}
          collisions={collisionsByDay.get(day) ?? EMPTY_COLLISIONS}
          onSelectGroup={onSelectGroup}
          isReadonly={isReadonly}
          startMinutes={startMinutes}
          endMinutes={endMinutes}
          minuteHeight={minuteHeight}
          hourMarks={hourMarks}
        />
      ))}
    </div>
  );
}

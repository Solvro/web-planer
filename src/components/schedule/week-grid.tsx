"use client";

import { useMemo } from "react";

import type { ExtendedGroup } from "@/atoms/plan-family";
import { ALL_DAYS, DAYS, WEEKEND_DAYS } from "@/constants/days";
import { useScheduleDensity } from "@/hooks/use-schedule-density";
import { useScheduleOrientation } from "@/hooks/use-schedule-orientation";
import { detectCollisions } from "@/lib/utils/detect-collisions";

import { DayColumn } from "./day-column";
import { DayRow } from "./day-row";
import {
  DENSITY_MINUTE_HEIGHT,
  DENSITY_MINUTE_WIDTH,
  DENSITY_ROW_HEIGHT,
  buildHourMarks,
  buildStartTimeMarks,
  formatMinutes,
  getDayTimeRange,
} from "./time-scale";

export function WeekGrid({
  allGroups,
  selectedGroups,
  onSelectGroup,
  isReadonly = false,
  onlyDaysWithGroups = false,
}: {
  allGroups: ExtendedGroup[];
  selectedGroups: ExtendedGroup[];
  onSelectGroup?: (groupId: string) => void;
  isReadonly?: boolean;
  onlyDaysWithGroups?: boolean;
}) {
  const { density } = useScheduleDensity();
  const { orientation } = useScheduleOrientation();

  const visibleDays = useMemo(() => {
    if (onlyDaysWithGroups) {
      return ALL_DAYS.filter((d) => allGroups.some((g) => g.day === d.day));
    }
    return [
      ...DAYS,
      ...WEEKEND_DAYS.filter((d) => allGroups.some((g) => g.day === d.day)),
    ];
  }, [allGroups, onlyDaysWithGroups]);

  const { startMinutes, endMinutes } = useMemo(
    () => getDayTimeRange(allGroups),
    [allGroups],
  );
  const hourMarks = useMemo(
    () => buildHourMarks(startMinutes, endMinutes),
    [startMinutes, endMinutes],
  );
  const collisions = useMemo(
    () => detectCollisions(selectedGroups),
    [selectedGroups],
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
              groups={allGroups.filter((g) => g.day === day)}
              selectedGroups={selectedGroups}
              collisions={collisions.filter((c) => c.day === day)}
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

  const timeGutter = (
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
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {timeGutter}
      {visibleDays.map(({ day, label }) => (
        <DayColumn
          key={day}
          label={label}
          groups={allGroups.filter((g) => g.day === day)}
          selectedGroups={selectedGroups}
          collisions={collisions.filter((c) => c.day === day)}
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

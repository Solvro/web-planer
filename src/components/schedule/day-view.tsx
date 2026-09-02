"use client";

import { useMemo } from "react";

import { ALL_DAYS } from "@/constants/days";
import { useScheduleDensity } from "@/hooks/use-schedule-density";
import { useScheduleView } from "@/hooks/use-schedule-view";
import { cn } from "@/lib/utils";

import { DayColumn } from "./day-column";
import type { ScheduleViewProps } from "./schedule-board";
import {
  DENSITY_MINUTE_HEIGHT,
  buildHourMarks,
  formatMinutes,
  getDayTimeRange,
} from "./time-scale";

export function DayView({
  allGroups,
  selectedGroups,
  collisions,
  onSelectGroup,
  isReadonly = false,
}: ScheduleViewProps) {
  const { density } = useScheduleDensity();
  const { selectedDay, setSelectedDay } = useScheduleView();
  const minuteHeight = DENSITY_MINUTE_HEIGHT[density];

  const activeDays = useMemo(() => {
    const withGroups = ALL_DAYS.filter((d) =>
      allGroups.some((g) => g.day === d.day),
    );
    return withGroups.length > 0 ? withGroups : ALL_DAYS.slice(0, 5);
  }, [allGroups]);
  const activeDay =
    activeDays.find((d) => d.day === selectedDay) ?? activeDays[0];

  const dayGroups = useMemo(
    () => allGroups.filter((g) => g.day === activeDay.day),
    [allGroups, activeDay.day],
  );
  const dayCollisions = useMemo(
    () => collisions.filter((c) => c.day === activeDay.day),
    [collisions, activeDay.day],
  );
  const { startMinutes, endMinutes } = useMemo(
    () => getDayTimeRange(dayGroups),
    [dayGroups],
  );
  const hourMarks = useMemo(
    () => buildHourMarks(startMinutes, endMinutes),
    [startMinutes, endMinutes],
  );
  const totalHeight = Math.max((endMinutes - startMinutes) * minuteHeight, 120);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {activeDays.map((d) => (
          <button
            key={d.day}
            type="button"
            onClick={() => {
              setSelectedDay(d.day);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              activeDay.day === d.day
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="w-14 shrink-0">
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
        <DayColumn
          label={activeDay.label}
          groups={dayGroups}
          selectedGroups={selectedGroups}
          collisions={dayCollisions}
          onSelectGroup={onSelectGroup}
          isReadonly={isReadonly}
          startMinutes={startMinutes}
          endMinutes={endMinutes}
          minuteHeight={minuteHeight}
          hourMarks={hourMarks}
          showHeader={false}
        />
      </div>
    </div>
  );
}

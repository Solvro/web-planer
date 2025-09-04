import React from "react";

import type { ExtendedGroup } from "@/atoms/plan-family";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePlanOrientation } from "@/hooks/use-plan-orientation";
import { cn } from "@/lib/utils";

import { ClassBlock } from "./class-block";
import { Hour } from "./hour";

const upperHoursBase = [
  "7:30",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "16:55",
  "17:50",
  "18:45",
  "19:40",
  "20:45",
  "21:40",
] as const;

const bottomHoursBase = [
  "8:15",
  "9:15",
  "10:15",
  "11:15",
  "12:15",
  "13:15",
  "14:15",
  "15:15",
  "16:10",
  "17:05",
  "18:00",
  "18:55",
  "19:50",
  "20:55",
  "21:50",
] as const;

const findMatchingScheduleTime = (inputTime: string): string | null => {
  const [hours, minutes] = inputTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  const allHours = [...upperHoursBase, ...bottomHoursBase];

  for (const scheduleTime of allHours) {
    const [scheduleHours, scheduleMinutes] = scheduleTime
      .split(":")
      .map(Number);
    const scheduleTotalMinutes = scheduleHours * 60 + scheduleMinutes;

    if (Math.abs(totalMinutes - scheduleTotalMinutes) <= 5) {
      return scheduleTime;
    }
  }

  return null;
};

function getMaxGroupsAtHourForDay(groups: ExtendedGroup[]) {
  const hourMap: Record<string, number> = {};
  for (const group of groups) {
    hourMap[group.startTime] = (hourMap[group.startTime] || 0) + 1;
  }
  const maxValue = Object.values(hourMap).reduce(
    (max, current) => Math.max(max, current),
    0,
  );

  return (maxValue * 190).toString();
}

const upperHours = upperHoursBase;
const bottomHours = bottomHoursBase;

function ClassSchedule({
  day,
  groups,
  selectedGroups,
  onSelectGroup,
  isReadonly = false,
}: {
  day: string;
  groups: ExtendedGroup[];
  selectedGroups: ExtendedGroup[];
  onSelectGroup?: (groupId: string) => void;
  isReadonly?: boolean;
}) {
  const { isHorizontal } = usePlanOrientation();
  const isMobile = useIsMobile();
  const widthPx = getMaxGroupsAtHourForDay(groups);

  return (
    <div
      className={cn(
        "flex min-w-fit flex-col border-y p-3",
        {
          "rounded-lg border-x": isReadonly || isMobile,
        },
        isHorizontal ? "border-x" : "border-y",
      )}
    >
      <div className="z-20 ml-2 flex items-center bg-white text-2xl font-semibold dark:bg-background">
        {day}
      </div>
      <div
        className={cn(
          isHorizontal
            ? "flex min-w-[200px] flex-1 flex-row text-[9px]"
            : "flex-1 overflow-auto overflow-y-hidden p-2 text-[9px]",
        )}
      >
        <div
          className={cn(
            isHorizontal
              ? "grid grid-rows-dayPlan"
              : "grid min-w-[1400px] grid-cols-dayPlan px-[10px]",
          )}
        >
          {upperHours.map((hour) => (
            <Hour hour={hour} key={hour} widthPx={widthPx} />
          ))}
          {bottomHours.map((hour) => (
            <Hour hour={hour} key={hour} widthPx={widthPx} />
          ))}
        </div>
        <div
          className={cn(
            isHorizontal
              ? "grid grid-rows-dayPlan gap-x-3 px-5 py-3"
              : "grid min-w-[1400px] grid-flow-col grid-cols-dayPlan gap-y-3 px-[10px] py-5",
          )}
        >
          <div
            className={cn(
              isHorizontal
                ? "absolute after:absolute after:bg-slate-200"
                : "absolute bottom-0 after:absolute after:left-1/2 after:w-[1px] after:bg-slate-200",
            )}
          />
          {groups.map((block) => {
            const isThisCourseChecked = selectedGroups.some(
              (g) =>
                g.courseId === block.courseId &&
                g.courseType === block.courseType,
            );
            return (
              <ClassBlock
                isReadonly={isReadonly}
                isDisabled={block.isChecked ? false : isThisCourseChecked}
                key={block.groupId + block.courseId + block.registrationId}
                {...block}
                onClick={() => {
                  onSelectGroup?.(block.groupId);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { ClassSchedule, findMatchingScheduleTime };

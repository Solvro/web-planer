import React from "react";

import type { ExtendedGroup } from "@/atoms/plan-family";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { ClassBlock } from "./class-block";
import { Hour } from "./hour";

const upperHours = [
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

const bottomHours = [
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

function ClassSchedule({
  day,
  groups,
  selectedGroups,
  isHorizontal,
  onSelectGroup,
  isReadonly = false,
}: {
  day: string;
  groups: ExtendedGroup[];
  selectedGroups: ExtendedGroup[];
  isHorizontal: boolean;
  onSelectGroup?: (groupId: string) => void;
  isReadonly?: boolean;
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn("flex min-w-fit flex-col border-y p-3", {
        "rounded-lg border-x": isReadonly || isMobile,
      })}
    >
      <div className="z-20 ml-2 flex items-center bg-white text-2xl font-semibold dark:bg-background">
        {day}
      </div>
      <div
        className={cn(
          isHorizontal
            ? "flex min-w-[1500px] flex-1 flex-row overflow-auto overflow-y-hidden text-[9px]"
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
            <Hour hour={hour} isHorizontal={isHorizontal} key={hour} />
          ))}
          {bottomHours.map((hour) => (
            <Hour hour={hour} isHorizontal={isHorizontal} key={hour} />
          ))}
        </div>
        <div
          className={cn(
            isHorizontal
              ? "grid grid-rows-dayPlan gap-x-3 py-3"
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
                isHorizontal={isHorizontal}
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

export { ClassSchedule };

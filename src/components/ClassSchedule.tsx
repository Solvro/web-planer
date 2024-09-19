import React from "react";

import type { ExtendedGroup } from "@/atoms/planFamily";

import { ClassBlock } from "./ClassBlock";
import { Hour } from "./Hour";

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

const ClassSchedule = ({
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
}) => {
  return (
    <div className="flex min-w-fit flex-col rounded-xl border-2 p-1">
      <div className="z-20 ml-2 flex items-center bg-white text-2xl font-semibold">
        {day}
      </div>
      <div className="flex-1 overflow-auto overflow-y-hidden p-2 text-[9px]">
        <div className="grid min-w-[1400px] grid-cols-dayPlan px-[10px]">
          {upperHours.map((hour, index) => (
            <Hour hour={hour} key={index} />
          ))}
          {bottomHours.map((hour, index) => (
            <Hour hour={hour} key={index} />
          ))}
        </div>
        <div className="grid min-w-[1400px] grid-flow-col grid-cols-dayPlan gap-y-3 px-[10px] py-5">
          <div className="absolute bottom-0 after:absolute after:left-1/2 after:w-[1px] after:bg-slate-200" />
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
};

export { ClassSchedule };

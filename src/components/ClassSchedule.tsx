import React from "react";

import type { ClassBlockProps } from "@/lib/types";
import type { ExtendedCourse, ExtendedGroup } from "@/pages/createplan/[id]";

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
  schedule,
  day,
  courses,
  groups,
  onClick,
}: {
  schedule: ClassBlockProps[];
  day: string;
  courses: ExtendedCourse[];
  groups: ExtendedGroup[];
  onClick: (id: string) => void;
}) => {
  return (
    <div className="flex min-w-fit flex-col overflow-visible rounded-xl border-2 p-1">
      <div className="z-20 ml-2 flex items-center bg-white text-2xl font-semibold">
        {day}
      </div>
      <div className="max-h-[300px] flex-1 overflow-auto p-2 text-[9px]">
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
          {schedule.map((block, index) => (
            <ClassBlock
              key={index}
              {...block}
              courses={courses}
              groups={groups}
              onClick={onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { ClassSchedule };

import React, { FC } from "react";
import { ClassBlockProps } from "@/lib/types";
import ClassBlock from "./ClassBlock";

type ClassScheduleProps = {
  schedule: ClassBlockProps[];
  day: string;
};

const ClassSchedule: FC<ClassScheduleProps> = ({ schedule, day }) => {
  const upperHours = [
    "7:30",
    "9:00",
    "9:15",
    "11:00",
    "11:15",
    "13:00",
    "13:15",
    "15:00",
    "15:15",
    "17:00",
    "17:05",
    "18:45",
    "18:55",
    "20:35",
  ];

  const bottomHours = [
    "8:15",
    "10:15",
    "12:15",
    "14:15",
    "16:10",
    "18:00",
    "19:50",
  ];

  return (
    <>
      <div className="flex justify-center items-center text-xl">{day}</div>
      <div className="flex flex-col text-xs gap-1 overflow-x-scroll p-1 scrollbar-thin scrollbar-thumb-sky-900 scrollbar-track-sky-300">
        <div className="min-w-[1400px]">
          <div className="grid grid-flow-col grid-cols-auto gap-0.5">
            {upperHours.map((hour, index) => (
              <div
                className={index % 2 === 0 ? `` : `flex justify-end`}
                key={hour}
              >
                {hour}
              </div>
            ))}
          </div>
          <div className="grid grid-flow-col grid-cols-auto gap-2">
            {bottomHours.map((hour) => (
              <div className="flex justify-center" key={hour}>
                {hour}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-14 grid-flow-col gap-1 min-w-[1400px]">
          {schedule.map((block, index) => (
            <ClassBlock key={index} {...block} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ClassSchedule;

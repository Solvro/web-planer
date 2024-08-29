import { cn } from "@/lib/utils";
import type { ExtendedCourse, ExtendedGroup } from "@/pages/createplan";

import React from "react";

const typeClasses = {
  W: "bg-red-300",
  L: "bg-blue-300",
  C: "bg-green-300",
  S: "bg-orange-300",
  P: "bg-fuchsia-200",
} as const;

function calculatePosition(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startGrid = startHour * 12 - 7 * 12 - 5 + startMinute / 5;

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const durationSpan = (endTotalMinutes - startTotalMinutes) / 5;

  return [startGrid, durationSpan];
}

const ClassBlock = ({
  startTime,
  endTime,
  group,
  courseName,
  lecturer,
  week,
  courseType,
  courses,
  groups,
  onClick,
}: {
  startTime: string;
  endTime: string;
  group: string;
  courseName: string;
  lecturer: string;
  week: "" | "TN" | "TP";
  courseType: "C" | "L" | "P" | "S" | "W";
  courses: ExtendedCourse[];
  groups: ExtendedGroup[];
  onClick: (id: string) => void;
}) => {
  const position = calculatePosition(startTime, endTime);
  const [startGrid, durationSpan] = position;
  const isCourseChecked = courses.find((course) => course.name === courseName);
  const checkedGroupFromCourse = groups.find(
    (g) =>
      g.courseType === courseType && courseName === g.courseName && g.isChecked
  );
  const isThisGroupChecked = checkedGroupFromCourse?.group === group;
  return (
    Boolean(isCourseChecked?.isChecked) && (
      <button
        disabled={checkedGroupFromCourse?.isChecked === true ? !isThisGroupChecked : false}
        onClick={() => { onClick(group); }}
        style={{
          gridColumnStart: startGrid,
          gridColumnEnd: `span ${durationSpan}`,
        }}
        className={cn(
          position,
          typeClasses[courseType],
          `p-2 rounded-lg shadow-md flex flex-col justify-center truncate relative`,
          checkedGroupFromCourse?.isChecked === true
            ? isThisGroupChecked
              ? "cursor-pointer"
              : "opacity-20"
            : "cursor-pointer opacity-60"
        )}
      >
        <div className="flex justify-between">
          <p>{`${courseType} ${week === "" ? "" : `|${week}`}`}</p>
          <p>{`Grupa ${group}`}</p>
        </div>
        <p className="font-bold truncate">{courseName}</p>
        <p className="font-semibold truncate">{lecturer}</p>
      </button>
    )
  );
};

export { ClassBlock };

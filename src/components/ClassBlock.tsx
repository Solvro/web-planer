import React from "react";

import { cn } from "@/lib/utils";
import type { ExtendedCourse, ExtendedGroup } from "@/pages/createplan/[id]";

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
  courseID,
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
  courseID: string;
  lecturer: string;
  week: "" | "TN" | "TP";
  courseType: "C" | "L" | "P" | "S" | "W";
  courses: ExtendedCourse[];
  groups: ExtendedGroup[];
  onClick: (id: string, courseType: string, group: string) => void;
}) => {
  const position = calculatePosition(startTime, endTime);
  const [startGrid, durationSpan] = position;
  const checkedGroupFromCourse = groups.find(
    (g) =>
      g.courseType === courseType && courseID === g.courseID && g.isChecked,
  );

  const isThisGroupChecked = checkedGroupFromCourse
    ? checkedGroupFromCourse.group === group
    : false;

  return (
    <button
      suppressHydrationWarning={true}
      disabled={
        checkedGroupFromCourse?.isChecked === true ? !isThisGroupChecked : false
      }
      onClick={() => {
        onClick(courseID, courseType, group);
      }}
      style={{
        gridColumnStart: startGrid,
        gridColumnEnd: `span ${durationSpan}`,
      }}
      className={cn(
        position,
        typeClasses[courseType],
        `relative flex flex-col truncate rounded-lg p-2 shadow-md`,
        checkedGroupFromCourse?.isChecked === true
          ? isThisGroupChecked
            ? "cursor-pointer"
            : "opacity-20"
          : "cursor-pointer opacity-60",
      )}
    >
      <div className="flex w-full justify-between">
        <p>{`${courseType} ${week === "" ? "" : `|${week}`}`}</p>
        <p>{`Grupa ${group}`}</p>
      </div>
      <p className="font-bold">{courseName}</p>
      <p className="font-semibold">{lecturer}</p>
    </button>
  );
};

export { ClassBlock };

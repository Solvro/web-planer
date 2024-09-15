import React from "react";

import type { ExtendedGroup } from "@/atoms/planFamily";
import { cn } from "@/lib/utils";

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

export const ClassBlock = ({
  startTime,
  endTime,
  groupId,
  groupNumber,
  courseId,
  courseName,
  lecturer,
  week,
  courseType,
  groups,
  onClick,
}: {
  startTime: string;
  endTime: string;
  groupId: string;
  groupNumber: string;
  courseName: string;
  courseId: string;
  lecturer: string;
  week: "" | "TN" | "TP";
  courseType: "C" | "L" | "P" | "S" | "W";
  groups: ExtendedGroup[];
  onClick: () => void;
}) => {
  const position = calculatePosition(startTime, endTime);
  const [startGrid, durationSpan] = position;
  const checkedGroupFromCourse = groups.find(
    (g) => groupId === g.groupId && g.isChecked,
  );
  const isThisGroupChecked = checkedGroupFromCourse?.groupId === groupId;
  return (
    <button
      suppressHydrationWarning={true}
      disabled={
        checkedGroupFromCourse?.isChecked === true ? !isThisGroupChecked : false
      }
      onClick={onClick}
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
        <p>{`Grupa ${groupNumber}`}</p>
      </div>
      <p className="truncate font-bold">{courseName}</p>
      <p className="truncate font-semibold">{lecturer}</p>
    </button>
  );
};

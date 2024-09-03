import React from "react";

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

const ReadonlyClassBlock = ({
  startTime,
  endTime,
  group,
  courseName,
  lecturer,
  week,
  courseType,
}: {
  startTime: string;
  endTime: string;
  group: string;
  courseName: string;
  lecturer: string;
  week: "" | "TN" | "TP";
  courseType: "C" | "L" | "P" | "S" | "W";
}) => {
  const position = calculatePosition(startTime, endTime);
  const [startGrid, durationSpan] = position;
  return (
    <button
      disabled={true}
      style={{
        gridColumnStart: startGrid,
        gridColumnEnd: `span ${durationSpan}`,
      }}
      className={cn(
        position,
        typeClasses[courseType],
        `relative flex flex-col justify-center truncate rounded-lg p-2 shadow-md`,
      )}
    >
      <div className="flex justify-between">
        <p>{`${courseType} ${week === "" ? "" : `|${week}`}`}</p>
        <p>{`Grupa ${group}`}</p>
      </div>
      <p className="truncate font-bold">{courseName}</p>
      <p className="truncate font-semibold">{lecturer}</p>
    </button>
  );
};

export { ReadonlyClassBlock };

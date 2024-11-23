import React from "react";

import { cn } from "@/lib/utils";

export const typeClasses = {
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
  groupNumber,
  courseName,
  lecturer,
  week,
  courseType,
  isChecked,
  isDisabled,
  onClick,
  isReadonly = false,
}: {
  startTime: string;
  endTime: string;
  groupNumber: string;
  courseName: string;
  lecturer: string;
  week: "" | "TN" | "TP";
  courseType: "C" | "L" | "P" | "S" | "W";
  isChecked: boolean;
  isDisabled: boolean;
  isReadonly?: boolean;
  onClick: () => void;
}) => {
  const position = calculatePosition(startTime, endTime);
  const [startGrid, durationSpan] = position;

  return (
    <button
      suppressHydrationWarning={true}
      disabled={isDisabled}
      onClick={isReadonly ? undefined : onClick}
      style={{
        gridColumnStart: startGrid,
        gridColumnEnd: `span ${durationSpan}`,
      }}
      className={cn(
        position,
        typeClasses[courseType],
        `relative flex flex-col truncate rounded-md p-2 shadow-md`,
        isChecked
          ? "cursor-pointer"
          : isDisabled
            ? "opacity-20"
            : "cursor-pointer opacity-60",
        isReadonly ? "cursor-default" : null,
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

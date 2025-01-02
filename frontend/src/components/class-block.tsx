import React from "react";

import { StarsRating } from "@/components/class-block-stars";
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

export function ClassBlock({
  startTime,
  endTime,
  groupNumber,
  courseName,
  lecturer,
  week,
  courseType,
  isChecked,
  isDisabled,
  spotsOccupied,
  spotsTotal,
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
  spotsOccupied: number;
  spotsTotal: number;
  onClick: () => void;
}) {
  const position = calculatePosition(startTime, endTime);
  const [startGrid, durationSpan] = position;
  const randomRating = Math.random() * 5;
  return (
    <button
      suppressHydrationWarning={true}
      disabled={isDisabled}
      onClick={isReadonly ? undefined : onClick}
      style={{
        gridColumnStart: startGrid,
        gridColumnEnd: `span ${durationSpan.toString()}`,
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
        <div className="flex gap-1">
          <p>{`${courseType} ${week === "" ? "" : `|${week}`}`}</p>
          <StarsRating rating={randomRating} />
        </div>
        <p>{`Grupa ${groupNumber}`}</p>
      </div>
      <p className="truncate font-bold">{courseName}</p>
      <p className="truncate font-semibold">{lecturer}</p>
      <p className="mt-2 flex w-full justify-between truncate">
        Miejsca:
        <span className="font-bold">
          {spotsOccupied}/{spotsTotal}
        </span>
      </p>
      <p className="flex w-full justify-between truncate">
        Średnia ocena:
        <span className="font-bold">
          {randomRating.toFixed(1)} (1200 opinii)
        </span>
      </p>
    </button>
  );
}

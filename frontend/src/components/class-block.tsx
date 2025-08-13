"use client";

import React from "react";

import { cn } from "@/lib/utils";

import { Icons } from "./icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const typeBgColors = {
  W: "bg-red-100 dark:bg-red-900",
  L: "bg-blue-100 dark:bg-blue-900",
  C: "bg-green-100 dark:bg-green-900",
  S: "bg-orange-100 dark:bg-orange-900",
  P: "bg-fuchsia-100 dark:bg-fuchsia-900",
} as const;

const typeBarColors = {
  W: "bg-red-500",
  L: "bg-blue-500",
  C: "bg-green-500",
  S: "bg-orange-500",
  P: "bg-fuchsia-500",
};

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
  isHorizontal,
  onClick,
  isReadonly = false,
  className,
  disableTooltip,
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
  spotsOccupied: number;
  spotsTotal: number;
  averageRating: number;
  opinionsCount: number;
  isHorizontal: boolean;
  onClick?: () => void;
  isReadonly?: boolean;
  className?: string;
  disableTooltip?: boolean;
}) {
  const position = calculatePosition(startTime, endTime);
  const [startGrid, durationSpan] = position;
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild={true}>
        <button
          suppressHydrationWarning={true}
          disabled={isDisabled}
          onClick={isReadonly ? undefined : onClick}
          style={
            isHorizontal
              ? {
                  gridRowStart: startGrid,
                  gridRowEnd: `span ${durationSpan.toString()}`,
                }
              : {
                  gridColumnStart: startGrid,
                  gridColumnEnd: `span ${durationSpan.toString()}`,
                }
          }
          className={cn(
            position,
            typeBgColors[courseType],
            `border-l-3 relative flex flex-col justify-between overflow-hidden truncate rounded-md p-2 shadow-md`,
            isChecked
              ? "cursor-pointer"
              : isDisabled
                ? "opacity-20 dark:opacity-10"
                : "cursor-pointer opacity-60 dark:opacity-40",
            isReadonly ? "cursor-default" : null,
            isHorizontal ? "w-48" : null,
            className,
          )}
        >
          <div
            className={cn(
              "absolute inset-y-0 left-0 top-0 w-[4px]",
              typeBarColors[courseType],
            )}
          ></div>
          <div className="flex w-full justify-between">
            <div className="flex gap-1">
              <p>{`${courseType} ${week === "" ? "" : `|${week}`}`}</p>
            </div>
            <p>{`Grupa ${groupNumber}`}</p>
          </div>
          <div>
            <p className="truncate font-bold">{courseName}</p>
            <p className="truncate font-semibold">{lecturer}</p>
          </div>
          <p className="mt-2 flex w-full justify-between truncate">
            <Icons.UsersRound className="size-3" />
            <span
              className={cn(
                "font-bold",
                spotsOccupied >= spotsTotal ? "text-red-500" : null,
              )}
            >
              {spotsOccupied}/{spotsTotal}
            </span>
          </p>
        </button>
      </TooltipTrigger>
      {disableTooltip === false && (
        <TooltipContent>
          <p>
            {courseName} - {lecturer}
          </p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}

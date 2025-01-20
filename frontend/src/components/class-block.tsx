import { UsersRoundIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const typeBgColors = {
  W: "bg-red-100",
  L: "bg-blue-100",
  C: "bg-green-100",
  S: "bg-orange-100",
  P: "bg-fuchsia-100",
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
  spotsOccupied: number;
  spotsTotal: number;
  averageRating: number;
  opinionsCount: number;
  onClick: () => void;
  isReadonly?: boolean;
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
          style={{
            gridColumnStart: startGrid,
            gridColumnEnd: `span ${durationSpan.toString()}`,
          }}
          className={cn(
            position,
            typeBgColors[courseType],
            `border-l-3 relative flex flex-col overflow-hidden truncate rounded-md p-2 shadow-md`,
            isChecked
              ? "cursor-pointer"
              : isDisabled
                ? "opacity-20"
                : "cursor-pointer opacity-60",
            isReadonly ? "cursor-default" : null,
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
          <p className="truncate font-bold">{courseName}</p>
          <p className="truncate font-semibold">{lecturer}</p>
          <p className="mt-2 flex w-full justify-between truncate">
            <UsersRoundIcon className="size-3" />
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
      <TooltipContent>
        <p>
          {courseName} - {lecturer}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

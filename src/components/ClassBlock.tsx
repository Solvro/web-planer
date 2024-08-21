import { cn } from "@/lib/utils";
import React, { FC } from "react";
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

const ClassBlock = (props: {
  startTime: string;
  endTime: string;
  group: string;
  courseName: string;
  lecturer: string;
  week: "TN" | "TP" | "";
  courseType: "W" | "L" | "C" | "S" | "P";
}) => {
  const position = calculatePosition(props.startTime, props.endTime);
  const [startGrid, durationSpan] = position;

  return (
    <div
      style={{
        gridColumnStart: startGrid,
        gridColumnEnd: `span ${durationSpan}`,
      }}
      className={cn(
        position,
        typeClasses[props.courseType],
        "p-2 rounded-lg shadow-md flex flex-col justify-center truncate relative"
      )}
    >
      <div className="flex justify-between">
        <p>{`${props.courseType} ${
          props.week === "" ? "" : `|${props.week}`
        }`}</p>
        <p>{`Grupa ${props.group}`}</p>
      </div>
      <p className="font-bold truncate">{props.courseName}</p>
      <p className="font-semibold truncate">{props.lecturer}</p>
    </div>
  );
};

export { ClassBlock };

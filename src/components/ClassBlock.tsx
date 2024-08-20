import { cn } from "@/lib/utils";
import React, { FC } from "react";
const typeClasses = {
  W: "bg-red-300",
  L: "bg-blue-300",
  C: "bg-green-300",
  S: "bg-orange-300",
  P: "bg-fuchsia-200",
} as const;

const hourClasses = {
  "7:30": "col-start-1",
  "8:15": "col-start-2",
  "9:15": "col-start-3",
  "10:15": "col-start-4",
  "11:15": "col-start-5",
  "12:15": "col-start-6",
  "13:15": "col-start-7",
  "14:15": "col-start-8",
  "15:15": "col-start-9",
  "16:10": "col-start-10",
  "17:05": "col-start-11",
  "18:00": "col-start-12",
  "18:55": "col-start-13",
  "19:50": "col-start-14",
} as const;

function calculateDurationSpans(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const duration = endTotalMinutes - startTotalMinutes;

  if (duration >= 60 && duration <= 105) {
    return "col-span-2";
  } else if (duration > 105) {
    return "col-span-3";
  }
  return "col-span-1";
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
  const duration = calculateDurationSpans(props.startTime, props.endTime);

  return (
    <div
      className={cn(
        hourClasses[props.startTime as keyof typeof hourClasses],
        duration,
        typeClasses[props.courseType],
        "p-2 rounded-lg shadow-md flex flex-col justify-center truncate"
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

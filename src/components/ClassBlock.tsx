import { cn } from "@/lib/utils";
import { extendedCourse, extendedGroup } from "@/pages/createplan";
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

const ClassBlock = (props: {
  startTime: string;
  endTime: string;
  group: string;
  courseName: string;
  lecturer: string;
  week: "TN" | "TP" | "";
  courseType: "W" | "L" | "C" | "S" | "P";
  courses: extendedCourse[];
  groups: extendedGroup[];
  onClick: (id: string) => void;
}) => {
  const position = calculatePosition(props.startTime, props.endTime);
  const [startGrid, durationSpan] = position;
  const isCourseChecked = props.courses.find((course) => course.name === props.courseName);
  //znajduje grupę z danego kursu, która jest zaznaczona
  const checkedGroupFromCourse = props.groups.find(
    (group) =>
      group.courseType === props.courseType && props.courseName === group.courseName && group.isChecked
  );
  //sprawdza czy ta grupa z danego kursu jest zaznaczona
  const isThisGroupChecked = checkedGroupFromCourse?.group === props.group;
  //Jesli ktoras grupa z tego kursu nie jest zaznaczona daje onClicka, jesli ktoras jest zaznaczona, ale to nie ona nie daje onClicka, jesli ktoras jest zaznaczona i to ona daje onClicka
  const newOnClick = Boolean(checkedGroupFromCourse?.isChecked)
    ? isThisGroupChecked
      ? () => props.onClick(props.group)
      : () => {}
    : () => props.onClick(props.group);
  return (
    Boolean(isCourseChecked?.isChecked) && (
      <div
        onClick={newOnClick}
        style={{
          gridColumnStart: startGrid,
          gridColumnEnd: `span ${durationSpan}`,
        }}
        className={cn(
          position,
          typeClasses[props.courseType],
          `p-2 rounded-lg shadow-md flex flex-col justify-center truncate relative ${
            Boolean(checkedGroupFromCourse?.isChecked)
              ? isThisGroupChecked
                ? "cursor-pointer"
                : "opacity-20"
              : "cursor-pointer opacity-60"
          }`
        )}
      >
        <div className="flex justify-between">
          <p>{`${props.courseType} ${props.week === "" ? "" : `|${props.week}`}`}</p>
          <p>{`Grupa ${props.group}`}</p>
        </div>
        <p className="font-bold truncate">{props.courseName}</p>
        <p className="font-semibold truncate">{props.lecturer}</p>
      </div>
    )
  );
};

export { ClassBlock };

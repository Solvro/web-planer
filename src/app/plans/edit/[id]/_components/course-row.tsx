"use client";

import { useState } from "react";

import { TYPE_BAR } from "@/components/schedule/type-colors";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, pluralize } from "@/lib/utils";
import { Day } from "@/types";
import type { ExtendedCourse } from "@/types";

const DAY_SHORT: Record<Day, string> = {
  [Day.MONDAY]: "pon",
  [Day.TUESDAY]: "wt",
  [Day.WEDNESDAY]: "śr",
  [Day.THURSDAY]: "czw",
  [Day.FRIDAY]: "pt",
  [Day.SATURDAY]: "sob",
  [Day.SUNDAY]: "nd",
};

type CourseStatus =
  "gotowe" | "kolizja" | "czesciowe" | "do-wyboru" | "brak-grupy";

const STATUS_LABEL: Record<CourseStatus, string> = {
  gotowe: "gotowe",
  kolizja: "kolizja",
  czesciowe: "częściowe",
  "do-wyboru": "do wyboru",
  "brak-grupy": "brak grupy",
};

const STATUS_CLASS: Record<CourseStatus, string> = {
  gotowe: "text-status-ready",
  kolizja: "text-status-collision",
  czesciowe: "text-status-partial",
  "do-wyboru": "text-status-pending",
  "brak-grupy": "text-status-pending",
};

export function CourseRow({
  course,
  collidingGroupIds,
  onToggleGroup,
  onToggleCourse,
}: {
  course: ExtendedCourse;
  collidingGroupIds: Set<string>;
  onToggleGroup: (groupId: string) => void;
  onToggleCourse: (isChecked: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const types = [...new Set(course.groups.map((group) => group.courseType))];
  const checkedTypes = new Set(
    course.groups
      .filter((group) => group.isChecked)
      .map((group) => group.courseType),
  );
  const hasCollision = course.groups.some(
    (group) => group.isChecked && collidingGroupIds.has(group.groupId),
  );

  const status: CourseStatus =
    course.groups.length === 0
      ? "brak-grupy"
      : hasCollision
        ? "kolizja"
        : checkedTypes.size === types.length
          ? "gotowe"
          : checkedTypes.size > 0
            ? "czesciowe"
            : "do-wyboru";

  return (
    <div className="border-border/60 border-b last:border-b-0">
      <button
        type="button"
        onClick={() => {
          setExpanded((value) => !value);
        }}
        className={cn(
          "hover:bg-muted/50 flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors",
          !course.isChecked && "opacity-40",
        )}
      >
        <span className="flex shrink-0 gap-0.5">
          {types.map((type) => (
            <span
              key={type}
              className={cn("h-8 w-1 rounded-full", TYPE_BAR[type])}
            />
          ))}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{course.name}</p>
          <p className="text-muted-foreground truncate text-xs">
            {types.join(" + ")} · {course.groups.length}{" "}
            {pluralize(course.groups.length, "grupa", "grupy", "grup")}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-xs font-medium",
            course.isChecked ? STATUS_CLASS[status] : "text-muted-foreground",
          )}
        >
          {course.isChecked
            ? status === "czesciowe"
              ? `${String(checkedTypes.size)}/${String(types.length)}`
              : STATUS_LABEL[status]
            : "wyłączony"}
        </span>
      </button>
      {expanded ? (
        <div className="flex flex-col gap-1 px-2 pb-3 pl-6">
          <label className="text-muted-foreground flex items-center justify-between gap-2 py-1 text-xs">
            Uwzględnij kurs w planie
            <Checkbox
              checked={course.isChecked}
              onCheckedChange={(checked) => {
                onToggleCourse(checked);
              }}
            />
          </label>
          {course.groups.map((group) => {
            const isFull = group.spotsOccupied >= group.spotsTotal;
            const isColliding =
              group.isChecked && collidingGroupIds.has(group.groupId);
            return (
              <label
                key={group.groupId}
                className={cn(
                  "hover:bg-muted/50 flex items-center gap-2 rounded-md p-1.5 text-sm",
                  isColliding && "bg-status-collision/10",
                )}
              >
                <span
                  className={cn(
                    "h-7 w-1 shrink-0 rounded-full",
                    TYPE_BAR[group.courseType],
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">
                    {group.courseType} grupa {group.groupNumber}
                    {group.week === "" ? "" : ` · ${group.week}`} ·{" "}
                    {DAY_SHORT[group.day]} {group.startTime}–{group.endTime}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {group.lecturer || "brak prowadzącego"} ·{" "}
                    <span
                      className={cn(
                        isFull && "text-status-collision font-medium",
                      )}
                    >
                      {group.spotsOccupied}/{group.spotsTotal} miejsc
                    </span>
                    {isColliding ? (
                      <span className="text-status-collision font-medium">
                        {" "}
                        · kolizja
                      </span>
                    ) : null}
                  </span>
                </span>
                <Checkbox
                  checked={group.isChecked}
                  onCheckedChange={() => {
                    onToggleGroup(group.groupId);
                  }}
                />
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";

import type { ExtendedCourse } from "@/atoms/plan-family";
import { TYPE_BAR } from "@/components/schedule/type-colors";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, pluralize } from "@/lib/utils";

type CourseStatus = "gotowe" | "kolizja" | "do-wyboru" | "brak-grupy";

const STATUS_LABEL: Record<CourseStatus, string> = {
  gotowe: "gotowe",
  kolizja: "kolizja",
  "do-wyboru": "do wyboru",
  "brak-grupy": "brak grupy",
};

const STATUS_CLASS: Record<CourseStatus, string> = {
  gotowe: "text-status-ready",
  kolizja: "text-status-collision",
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
  const checkedCount = course.groups.filter((group) => group.isChecked).length;
  const hasCollision = course.groups.some(
    (group) => group.isChecked && collidingGroupIds.has(group.groupId),
  );

  const status: CourseStatus =
    course.groups.length === 0
      ? "brak-grupy"
      : hasCollision
        ? "kolizja"
        : checkedCount > 0
          ? "gotowe"
          : "do-wyboru";

  return (
    <div className="border-border/60 border-b last:border-b-0">
      <button
        type="button"
        onClick={() => {
          setExpanded((value) => !value);
        }}
        className="hover:bg-muted/50 flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors"
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
          className={cn("shrink-0 text-xs font-medium", STATUS_CLASS[status])}
        >
          {STATUS_LABEL[status]}
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
          {course.groups.map((group) => (
            <label
              key={group.groupId}
              className="hover:bg-muted/50 flex items-center justify-between gap-2 rounded-md p-1.5 text-sm"
            >
              <span className="min-w-0 truncate">
                {group.courseType} grupa {group.groupNumber} · {group.lecturer}
              </span>
              <Checkbox
                checked={group.isChecked}
                onCheckedChange={() => {
                  onToggleGroup(group.groupId);
                }}
              />
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

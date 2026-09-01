"use client";

import { useMemo } from "react";

import type { ExtendedGroup } from "@/atoms/plan-family";
import { cn, pluralize } from "@/lib/utils";
import type { Collision } from "@/lib/utils/detect-collisions";
import { collidingGroupIds } from "@/lib/utils/detect-collisions";

import { ClassCard } from "./class-card";
import { layoutOverlaps, parseTimeToMinutes } from "./time-scale";

export function DayColumn({
  label,
  groups,
  selectedGroups,
  collisions,
  onSelectGroup,
  isReadonly = false,
  startMinutes,
  endMinutes,
  minuteHeight,
  hourMarks,
  showHeader = true,
}: {
  label: string;
  groups: ExtendedGroup[];
  selectedGroups: ExtendedGroup[];
  collisions: Collision[];
  onSelectGroup?: (groupId: string) => void;
  isReadonly?: boolean;
  startMinutes: number;
  endMinutes: number;
  minuteHeight: number;
  hourMarks: number[];
  showHeader?: boolean;
}) {
  const totalHeight = (endMinutes - startMinutes) * minuteHeight;
  const collidingIds = useMemo(
    () => collidingGroupIds(collisions),
    [collisions],
  );
  const layout = useMemo(
    () =>
      layoutOverlaps(groups, (group) => ({
        start: parseTimeToMinutes(group.startTime),
        end: parseTimeToMinutes(group.endTime),
      })),
    [groups],
  );
  const checkedCount = groups.filter((group) => group.isChecked).length;

  return (
    <div className={cn("min-w-[220px] flex-1", showHeader ? "" : "w-full")}>
      {showHeader ? (
        <div className="mb-2 h-10">
          <p className="font-semibold">{label}</p>
          <p className="text-muted-foreground text-xs">
            {checkedCount}{" "}
            {pluralize(checkedCount, "zajęcie", "zajęcia", "zajęć")}
            {collisions.length > 0
              ? ` · ${collisions.length.toString()} ${pluralize(collisions.length, "kolizja", "kolizje", "kolizji")}`
              : ""}
          </p>
        </div>
      ) : null}
      <div
        className="relative rounded-xl border-0"
        style={{ height: Math.max(totalHeight, 120) }}
      >
        {hourMarks.map((minute) => (
          <div
            key={minute}
            style={{ top: (minute - startMinutes) * minuteHeight }}
            className="border-border/60 absolute inset-x-0 border-t"
          />
        ))}
        {layout.map(({ item: group, start, end, column, columns }) => {
          const isThisCourseChecked = selectedGroups.some(
            (g) =>
              g.courseId === group.courseId &&
              g.courseType === group.courseType,
          );
          return (
            <ClassCard
              key={group.groupId + group.courseId + group.registrationId}
              group={group}
              isReadonly={isReadonly}
              isDisabled={group.isChecked ? false : isThisCourseChecked}
              isCollision={collidingIds.has(group.groupId)}
              onClick={() => {
                onSelectGroup?.(group.groupId);
              }}
              style={{
                top: (start - startMinutes) * minuteHeight,
                height: Math.max((end - start) * minuteHeight, 26),
                left: `${((column / columns) * 100).toString()}%`,
                width: `${(100 / columns).toString()}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

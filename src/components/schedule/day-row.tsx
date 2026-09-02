"use client";

import { useMemo } from "react";

import { pluralize } from "@/lib/utils";
import type { Collision } from "@/lib/utils/detect-collisions";
import { collidingGroupIds } from "@/lib/utils/detect-collisions";
import type { ExtendedGroup } from "@/types";

import { ClassCard } from "./class-card";
import {
  formatMinutes,
  layoutOverlaps,
  parseTimeToMinutes,
} from "./time-scale";

export function DayRow({
  label,
  groups,
  selectedGroups,
  collisions,
  onSelectGroup,
  isReadonly = false,
  startMinutes,
  endMinutes,
  minuteWidth,
  rowHeight,
  hourMarks,
  startTimeMarks,
}: {
  label: string;
  groups: ExtendedGroup[];
  selectedGroups: ExtendedGroup[];
  collisions: Collision[];
  onSelectGroup?: (groupId: string) => void;
  isReadonly?: boolean;
  startMinutes: number;
  endMinutes: number;
  minuteWidth: number;
  rowHeight: number;
  hourMarks: number[];
  startTimeMarks: number[];
}) {
  const totalWidth = Math.max((endMinutes - startMinutes) * minuteWidth, 480);
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
  const rows = layout.reduce((max, block) => Math.max(max, block.columns), 1);
  const rowTopPadding = 15;

  return (
    <section className="w-max min-w-full">
      <div className="mb-2 flex items-baseline gap-3">
        <h3 className="text-xl font-bold">{label}</h3>
        <p className="text-muted-foreground text-sm">
          {checkedCount}{" "}
          {pluralize(checkedCount, "zajęcie", "zajęcia", "zajęć")}
          {collisions.length > 0
            ? ` · ${collisions.length.toString()} ${pluralize(collisions.length, "kolizja", "kolizje", "kolizji")}`
            : ""}
        </p>
      </div>
      <div className="relative" style={{ width: totalWidth }}>
        <div className="relative h-9">
          {hourMarks.map((minute) => (
            <span
              key={`h-${minute.toString()}`}
              style={{ left: (minute - startMinutes) * minuteWidth }}
              className="text-foreground absolute top-0 text-sm font-medium"
            >
              {formatMinutes(minute)}
            </span>
          ))}
          {startTimeMarks.map((minute) => (
            <span
              key={`s-${minute.toString()}`}
              style={{ left: (minute - startMinutes) * minuteWidth }}
              className="text-muted-foreground absolute top-5 text-xs"
            >
              {formatMinutes(minute)}
            </span>
          ))}
        </div>
        <div
          className="relative rounded-xl border-0"
          style={{
            height: Math.max(rows * rowHeight, rowHeight) + rowTopPadding,
          }}
        >
          {hourMarks.map((minute) => (
            <div
              key={minute}
              style={{ left: (minute - startMinutes) * minuteWidth }}
              className="border-border/60 absolute inset-y-0 border-l"
            />
          ))}
          {layout.map(({ item: group, start, end, column }) => {
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
                  left: (start - startMinutes) * minuteWidth,
                  width: Math.max((end - start) * minuteWidth, 120),
                  top: column * rowHeight + rowTopPadding,
                  height: rowHeight - 10,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMemo } from "react";

import { ALL_DAYS } from "@/constants/days";
import { cn, pluralize } from "@/lib/utils";
import { collidingGroupIds } from "@/lib/utils/detect-collisions";

import type { ScheduleViewProps } from "./schedule-board";
import { TYPE_BAR, TYPE_LABELS } from "./type-colors";
import { groupByDay } from "./week-grid";

export function ListView({
  selectedGroups,
  collisions,
  onSelectGroup,
  isReadonly = false,
}: ScheduleViewProps) {
  const collidingIds = useMemo(
    () => collidingGroupIds(collisions),
    [collisions],
  );
  const groupsByDay = useMemo(
    () => groupByDay(selectedGroups),
    [selectedGroups],
  );
  const collisionsByDay = useMemo(() => groupByDay(collisions), [collisions]);

  const days = ALL_DAYS.filter((d) => groupsByDay.has(d.day));

  if (days.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        Nie wybrano jeszcze żadnych zajęć.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {days.map(({ day, label }) => {
        const dayGroups = (groupsByDay.get(day) ?? []).toSorted((a, b) =>
          a.startTime.localeCompare(b.startTime),
        );
        const dayCollisions = collisionsByDay.get(day)?.length ?? 0;

        return (
          <div key={day}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{label}</h3>
              {dayCollisions > 0 ? (
                <span className="text-status-collision text-xs font-medium">
                  {dayCollisions}{" "}
                  {pluralize(dayCollisions, "kolizja", "kolizje", "kolizji")}
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              {dayGroups.map((group) => (
                <button
                  key={group.groupId}
                  type="button"
                  onClick={() => {
                    onSelectGroup?.(group.groupId);
                  }}
                  disabled={isReadonly}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    collidingIds.has(group.groupId) &&
                      "border-status-collision/60 border-dashed",
                    !isReadonly && "hover:bg-muted/50",
                  )}
                >
                  <span
                    className={cn(
                      "h-8 w-1 shrink-0 rounded-full",
                      TYPE_BAR[group.courseType],
                    )}
                  />
                  <div className="w-24 shrink-0 text-sm font-medium">
                    {group.startTime}–{group.endTime}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{group.courseName}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {TYPE_LABELS[group.courseType]} · grupa{" "}
                      {group.groupNumber} · {group.lecturer}
                    </p>
                  </div>
                  <div className="text-muted-foreground shrink-0 text-xs font-semibold">
                    {group.spotsOccupied}/{group.spotsTotal}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import type { ExtendedGroup } from "@/atoms/plan-family";
import { ALL_DAYS } from "@/constants/days";
import { cn, pluralize } from "@/lib/utils";
import {
  collidingGroupIds,
  detectCollisions,
} from "@/lib/utils/detect-collisions";

import { TYPE_BAR, TYPE_LABELS } from "./type-colors";

export function ListView({
  allGroups,
  selectedGroups,
  onSelectGroup,
  isReadonly = false,
}: {
  allGroups: ExtendedGroup[];
  selectedGroups: ExtendedGroup[];
  onSelectGroup?: (groupId: string) => void;
  isReadonly?: boolean;
}) {
  const collisions = detectCollisions(selectedGroups);
  const collidingIds = collidingGroupIds(collisions);

  const days = ALL_DAYS.filter((d) =>
    allGroups.some((g) => g.day === d.day && g.isChecked),
  );

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
        const dayGroups = allGroups
          .filter((g) => g.day === day && g.isChecked)
          .toSorted((a, b) => a.startTime.localeCompare(b.startTime));
        const dayCollisions = collisions.filter((c) => c.day === day);

        return (
          <div key={day}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{label}</h3>
              {dayCollisions.length > 0 ? (
                <span className="text-status-collision text-xs font-medium">
                  {dayCollisions.length}{" "}
                  {pluralize(
                    dayCollisions.length,
                    "kolizja",
                    "kolizje",
                    "kolizji",
                  )}
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              {dayGroups.map((group) => (
                <button
                  key={group.groupId + group.courseId}
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

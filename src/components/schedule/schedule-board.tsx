"use client";

import type { ExtendedGroup } from "@/atoms/plan-family";
import { useScheduleView } from "@/hooks/use-schedule-view";
import { detectCollisions } from "@/lib/utils/detect-collisions";

import { CollisionBanner } from "./collision-banner";
import { DayView } from "./day-view";
import { DensitySwitcher } from "./density-switcher";
import { ScheduleLegend } from "./legend";
import { ListView } from "./list-view";
import { OrientationSwitch } from "./orientation-switch";
import { ViewSwitcher } from "./view-switcher";
import { WeekGrid } from "./week-grid";

export function ScheduleBoard({
  allGroups,
  selectedGroups,
  onSelectGroup,
}: {
  allGroups: ExtendedGroup[];
  selectedGroups: ExtendedGroup[];
  onSelectGroup: (groupId: string) => void;
}) {
  const { viewMode } = useScheduleView();
  const collisions = detectCollisions(selectedGroups);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <ViewSwitcher />
          {viewMode === "week" ? <OrientationSwitch /> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DensitySwitcher />
          <CollisionBanner collisions={collisions} />
        </div>
      </div>
      {viewMode === "week" ? (
        <WeekGrid
          allGroups={allGroups}
          selectedGroups={selectedGroups}
          onSelectGroup={onSelectGroup}
        />
      ) : viewMode === "day" ? (
        <DayView
          allGroups={allGroups}
          selectedGroups={selectedGroups}
          onSelectGroup={onSelectGroup}
        />
      ) : (
        <ListView
          allGroups={allGroups}
          selectedGroups={selectedGroups}
          onSelectGroup={onSelectGroup}
        />
      )}
      <ScheduleLegend />
    </div>
  );
}

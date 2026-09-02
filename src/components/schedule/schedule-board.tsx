"use client";

import { useScheduleView } from "@/hooks/use-schedule-view";
import type { Collision } from "@/lib/utils/detect-collisions";
import type { ExtendedGroup } from "@/types";

import { CollisionBanner } from "./collision-banner";
import { DayView } from "./day-view";
import { DensitySwitcher } from "./density-switcher";
import { ScheduleLegend } from "./legend";
import { ListView } from "./list-view";
import { OrientationSwitch } from "./orientation-switch";
import { ViewSwitcher } from "./view-switcher";
import { WeekGrid } from "./week-grid";

export interface ScheduleViewProps {
  /** Every slot that can be shown (all groups of included courses). */
  allGroups: ExtendedGroup[];
  /** Slots the user picked. */
  selectedGroups: ExtendedGroup[];
  /** Collisions between selected slots, computed once by the owner. */
  collisions: Collision[];
  onSelectGroup?: (groupId: string) => void;
  isReadonly?: boolean;
}

export function ScheduleBoard(props: ScheduleViewProps) {
  const { viewMode } = useScheduleView();

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <ViewSwitcher />
          {viewMode === "week" ? <OrientationSwitch /> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DensitySwitcher />
          <CollisionBanner collisions={props.collisions} />
        </div>
      </div>
      {viewMode === "week" ? (
        <WeekGrid {...props} />
      ) : viewMode === "day" ? (
        <DayView {...props} />
      ) : (
        <ListView {...props} />
      )}
      <ScheduleLegend />
    </div>
  );
}

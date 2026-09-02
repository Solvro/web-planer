"use client";

import { Icons } from "@/components/icons";
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
  allGroups: ExtendedGroup[];
  selectedGroups: ExtendedGroup[];
  collisions: Collision[];
  onSelectGroup?: (groupId: string) => void;
  isReadonly?: boolean;
}

export function ScheduleBoard(props: ScheduleViewProps) {
  const { viewMode } = useScheduleView();

  if (props.allGroups.length === 0) {
    return (
      <div className="flex h-full w-full flex-col gap-4">
        <div className="border-border/70 text-muted-foreground flex min-h-[320px] flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-8 text-center">
          <Icons.Plans className="text-primary/70 mb-2 size-8" />
          <p className="text-foreground text-base font-semibold">
            Zacznij od dodania rejestracji
          </p>
          <p className="max-w-sm text-sm text-balance">
            Wybierz wydział i rejestrację w panelu po lewej. Zajęcia pojawią się
            tutaj, a grupy zaznaczysz jednym kliknięciem.
          </p>
        </div>
      </div>
    );
  }

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

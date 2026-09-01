import { atomWithStorage } from "jotai/utils";

import { Day } from "@/types";

export type ScheduleViewMode = "week" | "day" | "list";

export const scheduleViewModeAtom = atomWithStorage<ScheduleViewMode>(
  "scheduleViewMode",
  "week",
);

export const scheduleSelectedDayAtom = atomWithStorage<Day>(
  "scheduleSelectedDay",
  Day.MONDAY,
);

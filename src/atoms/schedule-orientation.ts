import { atomWithStorage } from "jotai/utils";

export type ScheduleOrientation = "horizontal" | "vertical";

export const scheduleOrientationAtom = atomWithStorage<ScheduleOrientation>(
  "scheduleOrientation",
  "vertical",
);

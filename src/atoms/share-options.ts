import { atomWithStorage } from "jotai/utils";

import type { ScheduleOrientation } from "./schedule-orientation";

/** Options controlling how the plan is rendered for sharing/exporting as an image. */
export const shareHideDaysAtom = atomWithStorage<boolean>("hideDays", false);

export const shareHideLecturesAtom = atomWithStorage<boolean>(
  "shareHideLectures",
  false,
);

export const shareOrientationAtom = atomWithStorage<ScheduleOrientation>(
  "shareOrientation",
  "vertical",
);

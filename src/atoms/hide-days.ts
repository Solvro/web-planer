import { atomWithStorage } from "jotai/utils";

/** "Hide days without classes" toggle used when exporting the plan as an image. */
export const hideDaysAtom = atomWithStorage<boolean>("hideDays", false);

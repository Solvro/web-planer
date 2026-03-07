import { atomWithStorage } from "jotai/utils";

export type PlanOrientation = "vertical" | "horizontal";

export const planOrientationAtom = atomWithStorage<PlanOrientation>(
  "planOrientation",
  "vertical",
);

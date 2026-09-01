import { atomWithStorage } from "jotai/utils";

export type ScheduleDensity = "compact" | "standard" | "relaxed";

export const scheduleDensityAtom = atomWithStorage<ScheduleDensity>(
  "scheduleDensity",
  "standard",
);

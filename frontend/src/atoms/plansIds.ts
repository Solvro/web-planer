import { atomWithStorage } from "jotai/utils";

export const plansIds = atomWithStorage<Array<{ id: string }>>(
  "plansIds-v2",
  [],
);

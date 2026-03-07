import { atomWithStorage } from "jotai/utils";

export const plansIds = atomWithStorage<{ id: string }[]>("plansIds-v2", []);

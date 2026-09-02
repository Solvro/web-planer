import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { StoredPlan } from "@/types";

import { planFamily } from "./plan-family";

export const PLANS_IDS_STORAGE_KEY = "plansIds-v2";

/** Ordered list of local plan ids; the plan itself lives in `planFamily`. */
export const plansIdsAtom = atomWithStorage<{ id: string }[]>(
  PLANS_IDS_STORAGE_KEY,
  [],
  undefined,
  { getOnInit: true },
);

/** All local plans, de-duplicated by id, in list order. */
export const localPlansAtom = atom<StoredPlan[]>((get) => {
  const seen = new Set<string>();
  const plans: StoredPlan[] = [];
  for (const { id } of get(plansIdsAtom)) {
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    plans.push(get(planFamily({ id })));
  }
  return plans;
});

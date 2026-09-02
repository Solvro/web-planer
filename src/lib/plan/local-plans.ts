"use client";

import { useStore } from "jotai";
import { useMemo } from "react";

import {
  createEmptyPlan,
  planFamily,
  planStorageKey,
} from "@/atoms/plan-family";
import { PLANS_IDS_STORAGE_KEY, plansIdsAtom } from "@/atoms/plans-ids";
import type { StoredPlan } from "@/types";

type JotaiStore = ReturnType<typeof useStore>;

function createLocalPlan(
  store: JotaiStore,
  init: Partial<StoredPlan> = {},
): StoredPlan {
  const id = init.id ?? crypto.randomUUID();
  const plan: StoredPlan = { ...createEmptyPlan(id), ...init, id };
  store.set(planFamily({ id }), plan);
  store.set(plansIdsAtom, (ids) =>
    ids.some((entry) => entry.id === id) ? ids : [...ids, { id }],
  );
  return plan;
}

function removeLocalPlan(store: JotaiStore, id: string): void {
  store.set(plansIdsAtom, (ids) => ids.filter((entry) => entry.id !== id));
  planFamily.remove({ id });
  try {
    localStorage.removeItem(planStorageKey(id));
  } catch {
    // storage unavailable (private mode / quota) – nothing else to clean
  }
}

/**
 * Drops local copies of plans that are fully synced online. Called on sign
 * out so another user of the same browser does not see them. Works directly
 * on localStorage because the page reloads right after.
 */
export function removeSyncedLocalPlans(): void {
  const raw = localStorage.getItem(PLANS_IDS_STORAGE_KEY);
  if (raw === null) {
    return;
  }
  let ids: { id: string }[];
  try {
    ids = JSON.parse(raw) as { id: string }[];
  } catch {
    return;
  }

  const kept = ids.filter(({ id }) => {
    const stored = localStorage.getItem(planStorageKey(id));
    if (stored === null) {
      return true;
    }
    try {
      const plan = JSON.parse(stored) as Partial<StoredPlan>;
      const synced = plan.onlineId != null && plan.synced === true;
      if (synced) {
        localStorage.removeItem(planStorageKey(id));
      }
      return !synced;
    } catch {
      return true;
    }
  });

  localStorage.setItem(PLANS_IDS_STORAGE_KEY, JSON.stringify(kept));
}

/** Imperative access to local plans from event handlers. */
export function useLocalPlans() {
  const store = useStore();
  return useMemo(
    () => ({
      create: (init?: Partial<StoredPlan>) => createLocalPlan(store, init),
      remove: (id: string) => {
        removeLocalPlan(store, id);
      },
      get: (id: string) => store.get(planFamily({ id })),
      ids: () => store.get(plansIdsAtom),
    }),
    [store],
  );
}

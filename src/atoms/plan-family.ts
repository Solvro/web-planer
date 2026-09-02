import { atomFamily } from "jotai-family";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

import type { StoredPlan } from "@/types";

export const planStorageKey = (id: string) => `${id}-plan-v2`;

export function createEmptyPlan(id: string): StoredPlan {
  const now = new Date().toISOString();
  return {
    id,
    name: "Nowy plan",
    sharedId: null,
    courses: [],
    registrations: [],
    createdAt: now,
    updatedAt: now,
    onlineId: null,
    toCreate: true,
    synced: false,
    revision: 0,
  };
}

const toIsoString = (value: unknown, fallback: string): string => {
  if (typeof value === "string") {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? fallback : new Date(time).toISOString();
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  return fallback;
};

/**
 * Plans written by older versions of the app may miss fields or hold dates in
 * other formats. Everything read from storage goes through here so the rest of
 * the code can rely on the `StoredPlan` shape.
 */
function normalizeStoredPlan(
  raw: Partial<StoredPlan> | null | undefined,
  id: string,
): StoredPlan {
  const empty = createEmptyPlan(id);
  if (raw == null || typeof raw !== "object") {
    return empty;
  }
  return {
    id,
    name: typeof raw.name === "string" ? raw.name : empty.name,
    sharedId: typeof raw.sharedId === "string" ? raw.sharedId : null,
    courses: Array.isArray(raw.courses) ? raw.courses : [],
    registrations: Array.isArray(raw.registrations) ? raw.registrations : [],
    createdAt: toIsoString(raw.createdAt, empty.createdAt),
    updatedAt: toIsoString(raw.updatedAt, empty.updatedAt),
    onlineId: typeof raw.onlineId === "string" ? raw.onlineId : null,
    toCreate: raw.toCreate ?? true,
    synced: raw.synced ?? false,
    revision: typeof raw.revision === "number" ? raw.revision : 0,
  };
}

type PlanStorage = ReturnType<typeof createJSONStorage<StoredPlan>>;

const baseStorage: PlanStorage = createJSONStorage(() => localStorage);

const createPlanStorage = (id: string): PlanStorage => ({
  ...baseStorage,
  getItem: (key, initialValue) =>
    normalizeStoredPlan(baseStorage.getItem(key, initialValue), id),
});

export const planFamily = atomFamily(
  ({ id }: { id: string }) =>
    atomWithStorage<StoredPlan>(
      planStorageKey(id),
      createEmptyPlan(id),
      createPlanStorage(id),
      { getOnInit: true },
    ),
  (a, b) => a.id === b.id,
);

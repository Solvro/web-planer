"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { createNewPlan, getPlan, updatePlan } from "@/actions/plans";
import { planFamily } from "@/atoms/plan-family";
import { useSession } from "@/lib/auth-client";
import type {
  ExtendedGroup,
  OnlinePlan,
  Registration,
  StoredPlan,
} from "@/types";

import { planUpdates } from "./plan-updates";
import {
  fetchRegistrationDetails,
  useRegistrationCoursesFetcher,
  withSelection,
} from "./registration-courses";
import type { PlanHandle } from "./use-plan";

const AUTO_PUSH_DELAY_MS = 4000;
const ERROR_TOAST_DURATION_MS = 10_000;

export type SyncStatus =
  "local-only" | "syncing" | "synced" | "conflict" | "unsynced";

export const onlinePlanQueryKey = (onlineId: string | null) =>
  ["onlinePlan", onlineId] as const;

const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  return items.filter((item) =>
    seen.has(item.id) ? false : (seen.add(item.id), true),
  );
};

/** What the server stores: ids of chosen registrations, courses and groups. */
function toOnlinePayload(plan: StoredPlan) {
  const checkedCourses = plan.courses.filter((course) => course.isChecked);
  const groupIds = new Set(
    checkedCourses
      .flatMap((course) => course.groups)
      .filter((group) => group.isChecked)
      .map((group) => group.groupOnlineId),
  );
  return {
    name: plan.name,
    courses: checkedCourses.map(({ id }) => ({ id })),
    registrations: plan.registrations.map(({ id }) => ({ id })),
    groups: [...groupIds].map((id) => ({ id })),
  };
}

const sameInstant = (a: string, b: string) =>
  new Date(a).getTime() === new Date(b).getTime();

/**
 * Keeps a local plan and its online copy in sync:
 *  - creates the online copy for plans that only exist locally,
 *  - pulls online content into empty local shells (opened from the online list),
 *  - pushes local edits after a short debounce, unless the online copy changed
 *    elsewhere (conflict) – then the user decides via `pull` / `push`,
 *  - refreshes spots and meeting dates once per visit.
 */
/* eslint-disable react-you-might-not-need-an-effect/no-event-handler -- the effects below react to persisted state (not events) and start network work */
export function usePlanSync(plan: PlanHandle) {
  const session = useSession();
  const isLoggedIn = session.data != null;
  const sessionReady = !session.isPending;

  const router = useRouter();
  const store = useStore();
  const queryClient = useQueryClient();
  const fetchCourses = useRegistrationCoursesFetcher();

  const [offlineAlert, setOfflineAlert] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const { id: planId, setPlan } = plan;
  const planAtom = planFamily({ id: planId });
  /** Freshest plan state, safe to read inside async handlers. */
  const readPlan = useCallback(() => store.get(planAtom), [store, planAtom]);

  const onlineQueryKey = onlinePlanQueryKey(plan.onlineId);
  const onlinePlanQuery = useQuery({
    queryKey: onlineQueryKey,
    queryFn: async () => getPlan({ id: plan.onlineId ?? "" }),
    enabled: isLoggedIn && plan.onlineId !== null,
  });
  const onlinePlan: OnlinePlan | null | undefined = onlinePlanQuery.data;

  const isSynced =
    onlinePlan == null || sameInstant(plan.updatedAt, onlinePlan.updatedAt);
  const hasConflict = onlinePlan != null && !isSynced;

  const handleUnauthorized = useCallback(() => {
    setOfflineAlert(true);
  }, []);

  // --- create -------------------------------------------------------------

  const createOnline = useCallback(async () => {
    const current = readPlan();
    const result = await createNewPlan({
      id: current.id,
      ...toOnlinePayload(current),
    });

    if (result.ok) {
      setPlan(
        planUpdates.markCreatedOnline(
          result.data.id,
          result.data.updatedAt,
          current.revision,
        ),
      );
      toast.success("Utworzono plan");
      return;
    }
    if (result.reason === "unauthorized") {
      handleUnauthorized();
      return;
    }
    toast.error("Nie udało się utworzyć planu w wersji online", {
      description: result.message,
      duration: ERROR_TOAST_DURATION_MS,
    });
  }, [readPlan, setPlan, handleUnauthorized]);

  const createAttempted = useRef(false);
  useEffect(() => {
    if (
      !sessionReady ||
      !isLoggedIn ||
      plan.onlineId !== null ||
      createAttempted.current
    ) {
      return;
    }
    createAttempted.current = true;
    void createOnline();
  }, [sessionReady, isLoggedIn, plan.onlineId, createOnline]);

  // --- push ----------------------------------------------------------------

  const lastFailedRevision = useRef<number | null>(null);

  const push = useCallback(async () => {
    const current = readPlan();
    if (current.onlineId === null) {
      return;
    }
    setIsPushing(true);
    try {
      const payload = toOnlinePayload(current);
      const result = await updatePlan({ id: current.onlineId, ...payload });

      if (!result.ok) {
        lastFailedRevision.current = current.revision;
        if (result.reason === "unauthorized") {
          handleUnauthorized();
        } else {
          toast.error(result.message, { duration: ERROR_TOAST_DURATION_MS });
        }
        return;
      }

      const { updatedAt } = result.data;
      setPlan(planUpdates.markPushed(updatedAt, current.revision));
      queryClient.setQueryData<OnlinePlan | null>(
        onlinePlanQueryKey(current.onlineId),
        (online) =>
          online == null ? online : { ...online, ...payload, updatedAt },
      );
    } finally {
      setIsPushing(false);
    }
  }, [readPlan, setPlan, queryClient, handleUnauthorized]);

  const shouldAutoPush =
    isLoggedIn &&
    !offlineAlert &&
    plan.onlineId !== null &&
    !plan.toCreate &&
    !plan.synced &&
    onlinePlan != null &&
    isSynced;

  useEffect(() => {
    if (!shouldAutoPush || lastFailedRevision.current === plan.revision) {
      return;
    }
    const timer = setTimeout(() => {
      void push();
    }, AUTO_PUSH_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [shouldAutoPush, plan.revision, push]);

  // --- pull ----------------------------------------------------------------

  const pull = useCallback(async () => {
    const online =
      queryClient.getQueryData<OnlinePlan | null>(
        onlinePlanQueryKey(readPlan().onlineId),
      ) ?? null;
    if (online === null) {
      toast.error("Nie udało się pobrać planu online", {
        duration: ERROR_TOAST_DURATION_MS,
      });
      return;
    }

    setIsPulling(true);
    try {
      const courseIds = new Set(online.courses.map((course) => course.id));
      const groupIds = new Set(online.groups.map((group) => group.id));

      const perRegistration = await Promise.all(
        online.registrations.map(async ({ id }) => {
          const [registration, courses] = await Promise.all([
            fetchRegistrationDetails(id),
            fetchCourses(id),
          ]);
          return { registration, courses };
        }),
      );

      const registrations: Registration[] = uniqueById(
        perRegistration.map((entry) => entry.registration),
      );
      const courses = uniqueById(
        perRegistration.flatMap((entry) =>
          withSelection(entry.courses, {
            isCourseChecked: (course) => courseIds.has(course.id),
            isGroupChecked: (group) => groupIds.has(group.groupOnlineId),
          }),
        ),
      );

      setPlan(
        planUpdates.applyOnlinePlan({
          name: online.name,
          registrations,
          courses,
          updatedAt: online.updatedAt,
        }),
      );
    } catch {
      toast.error("Nie udało się pobrać kursów", {
        duration: ERROR_TOAST_DURATION_MS,
      });
    } finally {
      setIsPulling(false);
    }
  }, [queryClient, readPlan, fetchCourses, setPlan]);

  const pullAttempted = useRef(false);
  useEffect(() => {
    if (onlinePlan == null || !plan.toCreate || pullAttempted.current) {
      return;
    }
    pullAttempted.current = true;
    void pull();
  }, [onlinePlan, plan.toCreate, pull]);

  // --- online copy disappeared -------------------------------------------

  const onlinePlanMissing = onlinePlanQuery.isSuccess && onlinePlan === null;
  useEffect(() => {
    if (!onlinePlanMissing) {
      return;
    }
    toast.error("Nie udało się pobrać planu");
    router.replace("/plans");
  }, [onlinePlanMissing, router]);

  // --- refresh spots / dates ---------------------------------------------

  const refreshGroups = useCallback(async () => {
    const current = readPlan();
    const results = await Promise.allSettled(
      current.registrations.map(async ({ id }) => fetchCourses(id)),
    );

    const fresh = new Map<string, Partial<ExtendedGroup>>();
    for (const result of results) {
      if (result.status !== "fulfilled") {
        continue;
      }
      for (const course of result.value) {
        for (const group of course.groups) {
          fresh.set(group.groupOnlineId, {
            groupNumber: group.groupNumber,
            courseName: group.courseName,
            courseType: group.courseType,
            lecturer: group.lecturer,
            day: group.day,
            week: group.week,
            startTime: group.startTime,
            endTime: group.endTime,
            spotsOccupied: group.spotsOccupied,
            spotsTotal: group.spotsTotal,
            averageRating: group.averageRating,
            opinionsCount: group.opinionsCount,
            dates: group.dates,
          });
        }
      }
    }
    if (fresh.size > 0) {
      setPlan(planUpdates.refreshGroups(fresh));
    }
  }, [readPlan, fetchCourses, setPlan]);

  const refreshed = useRef(false);
  useEffect(() => {
    if (refreshed.current || plan.toCreate || plan.registrations.length === 0) {
      return;
    }
    refreshed.current = true;
    void refreshGroups();
  }, [plan.toCreate, plan.registrations.length, refreshGroups]);

  // --- status --------------------------------------------------------------

  let status: SyncStatus;
  if (plan.onlineId === null) {
    status = "local-only";
  } else if (isPushing || isPulling) {
    status = "syncing";
  } else if (hasConflict) {
    status = "conflict";
  } else if (plan.synced) {
    status = "synced";
  } else {
    status = "unsynced";
  }

  return {
    isLoggedIn,
    onlinePlan,
    status,
    isSynced,
    hasConflict,
    offlineAlert,
    isPushing,
    isPulling,
    push,
    pull,
  };
}
/* eslint-enable react-you-might-not-need-an-effect/no-event-handler */

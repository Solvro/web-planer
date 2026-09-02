"use client";

import { useAtom } from "jotai";
import { useMemo } from "react";

import { planFamily } from "@/atoms/plan-family";
import type { ExtendedCourse, ExtendedGroup, Registration } from "@/types";

import { planUpdates } from "./plan-updates";

export type PlanHandle = ReturnType<typeof usePlan>;

/**
 * Local plan state plus the edit actions the UI needs. Every action is a
 * functional update, so rapid consecutive edits never overwrite each other.
 */
export function usePlan(planId: string) {
  const [plan, setPlan] = useAtom(planFamily({ id: planId }));

  /** Every slot of every course included in the plan (checked or not). */
  const allGroups = useMemo<ExtendedGroup[]>(
    () =>
      plan.courses
        .filter((course) => course.isChecked)
        .flatMap((course) => course.groups),
    [plan.courses],
  );

  /** Slots the user actually picked. */
  const selectedGroups = useMemo(
    () => allGroups.filter((group) => group.isChecked),
    [allGroups],
  );

  const actions = useMemo(
    () => ({
      changeName: (name: string) => {
        void window.umami?.track("Change plan name");
        setPlan(planUpdates.changeName(name));
      },
      selectCourse: (courseId: string, isChecked?: boolean) => {
        void window.umami?.track("Check course");
        setPlan(planUpdates.selectCourse(courseId, isChecked));
      },
      selectGroup: (groupId: string, isChecked?: boolean) => {
        void window.umami?.track("Change group");
        setPlan(planUpdates.selectGroup(groupId, isChecked));
      },
      addRegistration: (
        registration: Registration,
        courses: ExtendedCourse[],
      ) => {
        setPlan(planUpdates.addRegistration(registration, courses));
      },
      removeRegistration: (registrationId: string) => {
        setPlan(planUpdates.removeRegistration(registrationId));
      },
      replaceSelection: (groupOnlineIds: Set<string>) => {
        setPlan(planUpdates.replaceSelection(groupOnlineIds));
      },
      setSharedId: (sharedId: string | null, updatedAt: string) => {
        setPlan(planUpdates.setSharedId(sharedId, updatedAt));
      },
    }),
    [setPlan],
  );

  return { ...plan, allGroups, selectedGroups, setPlan, ...actions };
}

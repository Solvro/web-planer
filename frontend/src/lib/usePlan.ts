import type { SetStateAction } from "jotai";
import { useAtom } from "jotai";

import { type ExtendedCourse, planFamily } from "@/atoms/planFamily";

import type { Registration } from "./types";

export interface PlanState {
  id: string;
  name: string;
  courses: ExtendedCourse[];
  registrations: Registration[];
  allGroups: ExtendedCourse["groups"];
  onlineId: string | null;
  synced: boolean;
  toCreate: boolean;
  createdAt: Date;
  updatedAt: Date;
  setPlan: (
    args_0: SetStateAction<{
      id: string;
      name: string;
      courses: ExtendedCourse[];
      registrations: Registration[];
      createdAt: Date;
      updatedAt: Date;
      onlineId: string | null;
      toCreate: boolean;
      synced: boolean;
    }>,
  ) => void;
}

export const usePlan = ({ planId }: { planId: string }) => {
  const [plan, setPlan] = useAtom(planFamily({ id: planId }));

  return {
    ...plan,
    allGroups: plan.courses.filter((c) => c.isChecked).flatMap((c) => c.groups),
    setPlan,
    remove: () => {
      planFamily.remove({ id: planId });
    },
    selectGroup: (groupId: string, isChecked?: boolean) => {
      void window.umami?.track("Change group");
      setPlan({
        ...plan,
        courses: plan.courses.map((course) => ({
          ...course,
          groups: course.groups.map((group) =>
            group.groupId === groupId
              ? { ...group, isChecked: isChecked ?? !group.isChecked }
              : group,
          ),
        })),
        synced: false,
      });
    },
    checkAllCourses: (registrationId: string, isChecked?: boolean) => {
      setPlan({
        ...plan,
        courses: plan.courses.map((course) =>
          course.registrationId === registrationId
            ? { ...course, isChecked: isChecked ?? !course.isChecked }
            : course,
        ),
        synced: false,
      });
    },
    addRegistration: (
      registration: Registration,
      courses: ExtendedCourse[],
      firstTime = false,
      updatedAt?: Date,
    ) => {
      setPlan({
        ...plan,
        registrations: [...plan.registrations, registration].filter(
          (r, i, a) => a.findIndex((t) => t.id === r.id) === i,
        ),
        courses: [...plan.courses, ...courses].filter(
          (c, i, a) => a.findIndex((t) => t.id === c.id) === i,
        ),

        synced: firstTime,
        toCreate: false,
        updatedAt: updatedAt ?? plan.updatedAt,
      });
    },
    removeRegistration: (registrationId: string) => {
      setPlan({
        ...plan,
        registrations: plan.registrations.filter(
          (r) => r.id !== registrationId,
        ),
        courses: plan.courses.filter(
          (c) => c.registrationId !== registrationId,
        ),
        synced: false,
      });
    },
    changeName: (newName: string) => {
      void window.umami?.track("Change plan name");
      setPlan({
        ...plan,
        name: newName,
        synced: false,
      });
    },
    setOnlineId: (onlineId: string) => {
      setPlan({
        ...plan,
        onlineId,
        synced: true,
      });
    },
    setSynced: (synced: boolean) => {
      setPlan({
        ...plan,
        synced,
      });
    },
    selectCourse: (courseId: string, isChecked?: boolean) => {
      void window.umami?.track("Check course");
      setPlan({
        ...plan,
        courses: plan.courses.map((course) =>
          course.id === courseId
            ? { ...course, isChecked: isChecked ?? !course.isChecked }
            : course,
        ),
        synced: false,
      });
    },
  };
};

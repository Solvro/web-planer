import { useAtom } from "jotai";

import { planFamily } from "@/atoms/plan-family";
import type { ExtendedCourse } from "@/atoms/plan-family";

import type { Registration } from "./types";

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
          (r, index, a) => a.findIndex((t) => t.id === r.id) === index,
        ),
        courses: [...plan.courses, ...courses].filter(
          (c, index, a) => a.findIndex((t) => t.id === c.id) === index,
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

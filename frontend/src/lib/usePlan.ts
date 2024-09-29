import { useAtom } from "jotai";

import { type ExtendedCourse, planFamily } from "@/atoms/planFamily";

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
      });
    },
    addRegistration: (
      registration: Registration,
      courses: ExtendedCourse[],
    ) => {
      setPlan({
        ...plan,
        registrations: [...plan.registrations, registration].filter(
          (r, i, a) => a.findIndex((t) => t.id === r.id) === i,
        ),
        courses: [...plan.courses, ...courses],
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
      });
    },
    changeName: (newName: string) => {
      void window.umami?.track("Change plan name");
      setPlan({
        ...plan,
        name: newName,
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
      });
    },
  };
};

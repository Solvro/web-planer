import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ExtendedCourse, ExtendedGroup } from "@/atoms/planFamily";
import type { PlanState } from "@/lib/usePlan";
import type { LessonType } from "@/services/usos/types";
import type { CourseType, PlanResponseType } from "@/types";

export const updateLocalPlan = async (
  onlinePlan: PlanResponseType | null | undefined,
  plan: PlanState,
  coursesFn: UseMutationResult<CourseType, Error, string>,
): Promise<boolean> => {
  if (!onlinePlan) {
    return false;
  }

  let updatedRegistrations: typeof plan.registrations = [];
  let updatedCourses: typeof plan.courses = [];

  for (const registration of onlinePlan.registrations) {
    try {
      const courses = await coursesFn.mutateAsync(registration.id);
      const extendedCourses: ExtendedCourse[] = courses
        .map((c) => {
          const groups: ExtendedGroup[] = c.groups.map((g) => ({
            groupId: g.group + c.id + g.type,
            groupNumber: g.group.toString(),
            groupOnlineId: g.id,
            courseId: c.id,
            courseName: c.name,
            isChecked:
              onlinePlan.courses
                .find((oc) => oc.id === c.id)
                ?.groups.some((og) => og.id === g.id) ?? false,
            courseType: g.type,
            day: g.day,
            lecturer: g.lecturer,
            registrationId: c.registrationId,
            week: g.week.replace("-", "") as "" | "TN" | "TP",
            endTime: g.endTime.split(":").slice(0, 2).join(":"),
            startTime: g.startTime.split(":").slice(0, 2).join(":"),
          }));
          return {
            id: c.id,
            name: c.name,
            isChecked: onlinePlan.courses.some((oc) => oc.id === c.id),
            registrationId: c.registrationId,
            type: c.groups.at(0)?.type ?? ("" as LessonType),
            groups,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      // Add unique registrations to the updatedRegistrations array
      updatedRegistrations = [...updatedRegistrations, registration].filter(
        (regist, index, array) =>
          array.findIndex((t) => t.id === regist.id) === index,
      );

      // Add unique courses to the updatedCourses array
      updatedCourses = [...updatedCourses, ...extendedCourses].filter(
        (course, index, array) =>
          array.findIndex((t) => t.id === course.id) === index,
      );
    } catch {
      toast.error("Nie udało się pobrać kursów");
    }
  }

  plan.setPlan({
    ...plan,
    registrations: updatedRegistrations,
    courses: updatedCourses,
    synced: true,
    toCreate: false,
    updatedAt: new Date(onlinePlan.updatedAt),
  });

  return true;
};

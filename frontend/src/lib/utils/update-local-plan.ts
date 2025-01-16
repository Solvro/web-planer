import type { UseMutationResult } from "@tanstack/react-query";

import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import type { LessonType } from "@/services/usos/types";
import type { CourseType, PlanResponseType } from "@/types";

import type { Registration } from "../types";

type UpdateLocalPlanResult =
  | {
      status: "ERROR";
      message: string;
    }
  | {
      status: "SUCCESS";
      updatedRegistrations: Registration[];
      updatedCourses: ExtendedCourse[];
      updatedAt: Date;
    };

/**
 * Updates local plan with online plan data.
 * @param onlinePlan Online plan data
 * @param coursesFn Function to fetch courses
 * @returns Objects ```{ status: "ERROR", message: string }``` or ```{ status: "SUCCESS", updatedRegistrations: Registration[], updatedCourses: ExtendedCourse[], updatedAt: Date }```
 */

export const updateLocalPlan = async (
  onlinePlan: PlanResponseType | null | undefined,
  coursesFunction: UseMutationResult<CourseType, Error, string>,
): Promise<UpdateLocalPlanResult> => {
  if (onlinePlan == null) {
    return { status: "ERROR", message: "Nie udało się pobrać planu online" };
  }

  let updatedRegistrations: Registration[] = [];
  let updatedCourses: ExtendedCourse[] = [];

  for (const registration of onlinePlan.registrations) {
    try {
      const courses = await coursesFunction.mutateAsync(registration.id);
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
            spotsOccupied: g.spotsOccupied,
            spotsTotal: g.spotsTotal,
            opinionsCount: g.opinionsCount,
            averageRating: g.averageRating,
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
      return { status: "ERROR", message: "Nie udało się pobrać kursów" };
    }
  }

  return {
    status: "SUCCESS",
    updatedRegistrations,
    updatedCourses,
    updatedAt: new Date(onlinePlan.updatedAt),
  };
};

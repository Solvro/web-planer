import type { UseMutationResult } from "@tanstack/react-query";

import type { ExtendedCourse } from "@/atoms/plan-family";
import type {
  CourseType,
  PlanResponseType,
  Registration,
  SingleCourse,
  SingleGroup,
} from "@/types";

import { serverToLocalPlan } from "./server-to-local-plan";

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
      const extendedCourses = serverToLocalPlan(
        courses,
        (course: SingleCourse) => {
          return onlinePlan.courses.some((oc) => oc.id === course.id);
        },
        (course: SingleCourse, group: SingleGroup) => {
          return (
            onlinePlan.courses
              .find((oc) => oc.id === course.id)
              ?.groups.some((og) => og.id === group.id) ?? false
          );
        },
      );

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

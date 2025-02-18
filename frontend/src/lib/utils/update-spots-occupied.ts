import type { UseMutationResult } from "@tanstack/react-query";

import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import type { CourseType, LessonType } from "@/types";

import type { usePlanType } from "../use-plan";

type UpdateSpotsOccupiedResult =
  | {
      status: "ERROR";
      message: string;
    }
  | {
      status: "SUCCESS";
      updatedCourses: ExtendedCourse[];
      isChanged: boolean;
    };

export const updateSpotsOccupied = async ({
  plan,
  coursesFunction,
}: {
  plan: usePlanType;
  coursesFunction: UseMutationResult<CourseType, Error, string>;
}): Promise<UpdateSpotsOccupiedResult> => {
  let updatedCourses: ExtendedCourse[] = [];
  let isChanged = false;

  for (const registration of plan.registrations) {
    try {
      const courses = await coursesFunction.mutateAsync(registration.id);
      const extendedCourses: ExtendedCourse[] = courses
        .map((c) => {
          const groups: (ExtendedGroup | null)[] = c.groups.map((g) => {
            const currentGroup = plan.courses
              .find((course) => course.id === c.id)
              ?.groups.find(
                (group) => group.groupId === g.group + c.id + g.type,
              );
            if (currentGroup === undefined) {
              return null;
            } else if (currentGroup.spotsOccupied === g.spotsOccupied) {
              return currentGroup;
            }
            isChanged = true;
            return {
              ...currentGroup,
              spotsOccupied: g.spotsOccupied,
              spotsTotal: g.spotsTotal,
            };
          });
          return {
            id: c.id,
            name: c.name,
            isChecked: plan.courses.some((oc) => oc.id === c.id),
            registrationId: c.registrationId,
            type: c.groups.at(0)?.type ?? ("" as LessonType),
            groups: groups.filter((g): g is ExtendedGroup => g !== null),
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

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
    updatedCourses,
    isChanged,
  };
};

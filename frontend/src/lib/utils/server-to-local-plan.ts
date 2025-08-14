import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import type {
  CourseType,
  LessonType,
  SingleCourse,
  SingleGroup,
} from "@/types";

export const serverToLocalPlan = (
  courses: CourseType,
  shouldCourseBeChecked: ((course: SingleCourse) => boolean) | boolean,
  shouldGroupBeChecked:
    | ((course: SingleCourse, group: SingleGroup) => boolean)
    | boolean,
) => {
  const extendedCourses: ExtendedCourse[] = courses
    .map((c) => ({
      id: c.id,
      name: c.name,
      isChecked:
        typeof shouldCourseBeChecked === "boolean"
          ? shouldCourseBeChecked
          : shouldCourseBeChecked(c),
      registrationId: c.registrationId,
      type: c.groups.at(0)?.type ?? ("" as LessonType),
      groups: c.groups.map(
        (g) =>
          ({
            groupId: g.group + c.id + g.type,
            groupNumber: g.group,
            groupOnlineId: g.id,
            courseId: c.id,
            courseName: c.name,
            isChecked:
              typeof shouldGroupBeChecked === "boolean"
                ? shouldGroupBeChecked
                : shouldGroupBeChecked(c, g),
            courseType: g.type,
            day: g.day,
            lecturer: g.lecturer,
            registrationId: c.registrationId,
            week: g.week.replace("-", "") as "" | "TN" | "TP",
            endTime: g.endTime.split(":").slice(0, 2).join(":"),
            startTime: g.startTime.split(":").slice(0, 2).join(":"),
            spotsOccupied: g.spotsOccupied,
            spotsTotal: g.spotsTotal,
            averageRating: g.averageRating,
            opinionsCount: g.opinionsCount,
          }) satisfies ExtendedGroup,
      ),
    }))
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  return extendedCourses;
};

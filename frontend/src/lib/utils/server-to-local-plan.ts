import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import type {
  CourseType,
  Day,
  GroupMeeting,
  LessonType,
  SingleCourse,
  SingleGroup,
} from "@/types";

export const serverToLocalPlan = (
  courses: CourseType,
  shouldCourseBeChecked: ((course: SingleCourse) => boolean) | boolean,
  shouldGroupBeChecked:
    | ((
        course: SingleCourse,
        group: SingleGroup,
        meeting: GroupMeeting,
      ) => boolean)
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
      groups: c.groups.flatMap(
        (g) =>
          g.meetings.map((meeting) => ({
            groupId: g.group + c.id + g.type + meeting.id.toString(),
            groupNumber: g.group,
            groupOnlineId: g.id,
            courseId: c.id,
            courseName: c.name,
            isChecked:
              typeof shouldGroupBeChecked === "boolean"
                ? shouldGroupBeChecked
                : shouldGroupBeChecked(c, g, meeting),
            courseType: g.type,
            day: meeting.day as Day,
            lecturer: g.lecturer,
            registrationId: c.registrationId,
            week:
              meeting.week === "-"
                ? ""
                : (meeting.week as "" | "TN" | "TP" | "!"),
            endTime: meeting.endTime.split(":").slice(0, 2).join(":"),
            startTime: meeting.startTime.split(":").slice(0, 2).join(":"),
            spotsOccupied: g.spotsOccupied,
            spotsTotal: g.spotsTotal,
            averageRating: Number.parseFloat(g.averageRating),
            opinionsCount: g.opinionsCount,
          })) satisfies ExtendedGroup[],
      ),
    }))
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  return extendedCourses;
};

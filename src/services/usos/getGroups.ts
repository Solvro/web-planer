import { createUsosService } from "@/lib/usos";
import { GetUserRegistrations } from "@/services/usos/getUserRegistrations";
import { GetRegistrationRoundCourses } from "@/services/usos/getRegistrationRoundCourses";
import { Day } from "@/services/usos/types";
import { LessonType } from "@/services/usos/types";
import { Frequency } from "@/services/usos/types";

// export async function GET() {
//   const usosService = await createUsosService();
//   const registrations = await usosService.getUserRegistrations();
//   const coursesRegistrations = await Promise.all(
//     registrations.map(async (registration) => {
//       return {
//         registration: registration,
//         courses: await usosService.getRegistrationRoundCourses(registration.id),
//       };
//     })
//   );

//   const groupsCoursesRegistrations = await Promise.all(
//     coursesRegistrations.map(async (coursesRegistration) => {
//       return await Promise.all(
//         coursesRegistration.courses.map(async (course) => {
//           return {
//             registration: coursesRegistration.registration,
//             course: course.course,
//             groups: await usosService.getGroups(course.course.id),
//           };
//         })
//       );
//     })
//   );
//   return Response.json(groupsCoursesRegistrations);
// }

type Time = {
  hours: number;
  minutes: number;
};
export interface Group {
  hourStartTime: Time;
  hourEndTime: Time;
  duration: Time;
  person: string;
  personLink: string;
  groupLink: string;
  day: Day;
  courseId: string;
  type: LessonType;
  nameExtended: string;
  groupNumber: number;
  frequency: Frequency;
  name: string;
  isChecked?: boolean;
}

export async function getGroups() {
  return dummyData;
}

export interface DummyData {
  registration: {
    id: string;
    name: string;
  };
  courses: {
    course: {
      id: string;
      name: string;
    };
    groups: Group[];
  }[];
}

const dummyData: DummyData[] = [
  {
    registration: {
      id: "1",
      name: "Registration 1",
    },
    courses: [
      {
        course: {
          id: "1",
          name: "Course 1",
        },
        groups: [
          {
            hourStartTime: { hours: 9, minutes: 0 },
            hourEndTime: { hours: 10, minutes: 30 },
            duration: { hours: 1, minutes: 30 },
            person: "John Doe",
            personLink: "https://example.com/johndoe",
            groupLink: "https://example.com/group1",
            day: Day.MONDAY,
            courseId: "1",
            type: LessonType.LECTURE,
            nameExtended: "Lecture Group 1",
            groupNumber: 1,
            frequency: Frequency.EVERY,
            name: "Group 1",
          },
          {
            hourStartTime: { hours: 13, minutes: 0 },
            hourEndTime: { hours: 14, minutes: 30 },
            duration: { hours: 1, minutes: 30 },
            person: "Jane Smith",
            personLink: "https://example.com/janesmith",
            groupLink: "https://example.com/group2",
            day: Day.TUESDAY,
            courseId: "1",
            type: LessonType.LABORATORY,
            nameExtended: "Lab Group 2",
            groupNumber: 2,
            frequency: Frequency.ODD,
            name: "Group 2",
          },
        ],
      },
      {
        course: {
          id: "2",
          name: "Course 2",
        },
        groups: [
          {
            hourStartTime: { hours: 10, minutes: 0 },
            hourEndTime: { hours: 11, minutes: 30 },
            duration: { hours: 1, minutes: 30 },
            person: "Alice Johnson",
            personLink: "https://example.com/alicejohnson",
            groupLink: "https://example.com/group3",
            day: Day.WEDNESDAY,
            courseId: "2",
            type: LessonType.LECTURE,
            nameExtended: "Lecture Group 3",
            groupNumber: 1,
            frequency: Frequency.ODD,
            name: "Group 3",
          },
          {
            hourStartTime: { hours: 14, minutes: 0 },
            hourEndTime: { hours: 15, minutes: 30 },
            duration: { hours: 1, minutes: 30 },
            person: "Bob Williams",
            personLink: "https://example.com/bobwilliams",
            groupLink: "https://example.com/group4",
            day: Day.THURSDAY,
            courseId: "2",
            type: LessonType.LABORATORY,
            nameExtended: "Lab Group 4",
            groupNumber: 2,
            frequency: Frequency.EVEN,
            name: "Group 4",
          },
        ],
      },
    ],
  },
  {
    registration: {
      id: "3",
      name: "Registration 3",
    },
    courses: [
      {
        course: {
          id: "3",
          name: "Course 3",
        },
        groups: [
          {
            hourStartTime: { hours: 9, minutes: 0 },
            hourEndTime: { hours: 10, minutes: 30 },
            duration: { hours: 1, minutes: 30 },
            person: "Sarah Brown",
            personLink: "https://example.com/sarahbrown",
            groupLink: "https://example.com/group5",
            day: Day.MONDAY,
            courseId: "3",
            type: LessonType.LECTURE,
            nameExtended: "Lecture Group 5",
            groupNumber: 1,
            frequency: Frequency.EVERY,
            name: "Group 5",
          },
          {
            hourStartTime: { hours: 13, minutes: 0 },
            hourEndTime: { hours: 14, minutes: 30 },
            duration: { hours: 1, minutes: 30 },
            person: "Michael Davis",
            personLink: "https://example.com/michaeldavis",
            groupLink: "https://example.com/group6",
            day: Day.TUESDAY,
            courseId: "3",
            type: LessonType.LABORATORY,
            nameExtended: "Lab Group 6",
            groupNumber: 2,
            frequency: Frequency.ODD,
            name: "Group 6",
          },
        ],
      },
    ],
  },
];

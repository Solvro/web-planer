import { PlanResponseDataType } from "@/app/plans/page";
import { ExtendedGroup } from "@/atoms/plan-family";
import { Day, FacultyType, Registration } from "@/types";

export const mockGroups1: ExtendedGroup[] = [
  {
    isChecked: true,
    startTime: "08:00",
    endTime: "09:30",
    groupId: "g1",
    groupNumber: "101",
    groupOnlineId: 1001,
    courseId: "course-1",
    courseName: "Analiza Matematyczna 1",
    lecturer: "Dr. Smith",
    day: Day.MONDAY,
    week: "",
    courseType: "L",
    registrationId: "reg-1",
    spotsOccupied: 15,
    spotsTotal: 30,
    averageRating: 4.5,
    opinionsCount: 10,
  },
  {
    isChecked: false,
    startTime: "08:00",
    endTime: "09:30",
    groupId: "g2",
    groupNumber: "102",
    groupOnlineId: 1002,
    courseId: "course-1",
    courseName: "Analiza Matematyczna 1",
    lecturer: "Dr. Brown",
    day: Day.WEDNESDAY,
    week: "",
    courseType: "W",
    registrationId: "reg-1",
    spotsOccupied: 15,
    spotsTotal: 30,
    averageRating: 4.5,
    opinionsCount: 10,
  },
];

export const mockGroups2: ExtendedGroup[] = [
  {
    isChecked: true,
    startTime: "08:00",
    endTime: "09:30",
    groupId: "g1",
    groupNumber: "101",
    groupOnlineId: 1001,
    courseId: "course-2",
    courseName: "Analiza Matematyczna 1",
    lecturer: "Dr. Smith",
    day: Day.THURSDAY,
    week: "",
    courseType: "W",
    registrationId: "reg-1",
    spotsOccupied: 15,
    spotsTotal: 30,
    averageRating: 4.5,
    opinionsCount: 10,
  },
  {
    isChecked: false,
    startTime: "08:00",
    endTime: "09:30",
    groupId: "g2",
    groupNumber: "102",
    groupOnlineId: 1002,
    courseId: "course-2",
    courseName: "Analiza Matematyczna 1",
    lecturer: "Dr. Brown",
    day: Day.WEDNESDAY,
    week: "",
    courseType: "L",
    registrationId: "reg-1",
    spotsOccupied: 15,
    spotsTotal: 30,
    averageRating: 4.5,
    opinionsCount: 10,
  },
];

export const mockGroups3: ExtendedGroup[] = [
  {
    isChecked: false,
    startTime: "08:00",
    endTime: "09:30",
    groupId: "g1",
    groupNumber: "101",
    groupOnlineId: 1001,
    courseId: "course-3",
    courseName: "Analiza Matematyczna 1",
    lecturer: "Dr. Smith",
    day: Day.MONDAY,
    week: "",
    courseType: "W",
    registrationId: "reg-1",
    spotsOccupied: 15,
    spotsTotal: 30,
    averageRating: 4.5,
    opinionsCount: 10,
  },
];

export const mockFaculties: FacultyType[] = [
  {
    id: "id1",
    name: "faculty 1",
    departmentId: "dep1",
  },
  {
    id: "id2",
    name: "faculty 2",
    departmentId: "dep2",
  },
  {
    id: "id3",
    name: "faculty 3",
    departmentId: "dep2",
  },
];

export const mockRegistrations: Registration[] = [
  { id: "reg1", name: "Registration 1" },
  { id: "reg2", name: "Registration 2" },
];

export const mockPlans: PlanResponseDataType[] = [
  {
    id: 1,
    userId: 101,
    name: "Plan nr 1",
    sharedId: "abc123",
    createdAt: "2025-07-01T10:00:00.000Z",
    updatedAt: "2025-07-20T12:00:00.000Z",
    courses: [
      {
        isChecked: true,
        id: "course-1",
        name: "Analiza Matematyczna 1",
        type: "lecture",
        registrationId: "reg-1",
        groups: mockGroups1,
      },
      {
        isChecked: true,
        id: "course-2",
        name: "Algebra 1",
        type: "lecture",
        registrationId: "reg-1",
        groups: mockGroups2,
      },
      {
        isChecked: false,
        id: "course-3",
        name: "PSIO",
        type: "lecture",
        registrationId: "reg-1",
        groups: mockGroups3,
      },
    ],
    registrations: mockRegistrations,
  },
];

export const newPlan: PlanResponseDataType = {
  id: 2,
  userId: 101,
  name: "Plan nr 2",
  sharedId: "ab11c123",
  createdAt: new Date("2024-01-01T12:00:00Z").toISOString(),
  updatedAt: new Date("2024-01-01T12:00:00Z").toISOString(),
  courses: [
    {
      isChecked: true,
      id: "course-1",
      name: "Test 1",
      type: "lecture",
      registrationId: "reg-2",
      groups: mockGroups1,
    },
    {
      isChecked: true,
      id: "course-2",
      name: "Długi przedmiot z długą nazwą",
      type: "lecture",
      registrationId: "reg-2",
      groups: mockGroups2,
    },
    {
      isChecked: false,
      id: "course-3",
      name: "Matematyka Dyskretna",
      type: "lab",
      registrationId: "reg-2",
      groups: mockGroups3,
    },
  ],
  registrations: mockRegistrations,
};

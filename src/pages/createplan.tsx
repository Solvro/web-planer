import ScheduleTest from "@/components/schedule";
import SelectGroups from "@/components/selectGroups";
import type { GetServerSideProps } from "next";

import { DummyData } from "@/services/usos/getGroups";
import { getGroups } from "@/services/usos/getGroups";
import Link from "next/link";
import { ClassBlockProps, Course, Registration } from "@/lib/types";
import { useState } from "react";

const mockRegistration1 = {
  name: "Registration 1",
} satisfies Registration;

const mockRegistration2 = {
  name: "Registration 2",
} satisfies Registration;

const mockRegistration3 = {
  name: "Registration 3",
} satisfies Registration;

const mockCourse1 = {
  name: "Fizyka I",
  registrationName: mockRegistration1.name,
} satisfies Course;

const mockCourse2 = {
  name: "Wykład X",
  registrationName: mockRegistration1.name,
} satisfies Course;

const mockCourse3 = {
  name: "Seminarium X",
  registrationName: mockRegistration2.name,
} satisfies Course;

const mockCourse4 = {
  name: "Cwiczenia X",
  registrationName: mockRegistration2.name,
} satisfies Course;

const mockL = {
  startTime: "17:05",
  endTime: "19:50",
  group: "1",
  courseName: mockCourse1.name,
  lecturer: "Jerzy Świątek",
  week: "TN",
  courseType: "L",
  registrationName: mockCourse1.registrationName,
} satisfies ClassBlockProps;

const mockW = {
  startTime: "18:55",
  endTime: "19:50",
  group: "2",
  courseName: mockCourse2.name,
  lecturer: "Jerzy Świątek",
  week: "",
  courseType: "W",
  registrationName: mockCourse2.registrationName,
} satisfies ClassBlockProps;

const mockS = {
  startTime: "13:15",
  endTime: "15:00",
  group: "3",
  courseName: mockCourse3.name,
  lecturer: "Jerzy Świątek",
  week: "TP",
  courseType: "S",
  registrationName: mockCourse3.registrationName,
} satisfies ClassBlockProps;

const mockC = {
  startTime: "7:30",
  endTime: "9:00",
  group: "4",
  courseName: mockCourse4.name,
  lecturer: "Andrzej Piaseczny",
  week: "",
  courseType: "C",
  registrationName: mockCourse4.registrationName,
} satisfies ClassBlockProps;

const mockP = {
  startTime: "9:15",
  endTime: "11:00",
  group: "5",
  courseName: mockCourse1.name,
  lecturer: "Jerzy Świątek",
  week: "",
  courseType: "P",
  registrationName: mockCourse1.registrationName,
} satisfies ClassBlockProps;

const mock1115 = {
  startTime: "11:15",
  endTime: "13:00",
  group: "6",
  courseName: mockCourse2.name,
  lecturer: "Jerzy Świątek",
  week: "",
  courseType: "L",
  registrationName: mockCourse2.registrationName,
} satisfies ClassBlockProps;

const mock1610 = {
  startTime: "16:10",
  endTime: "16:55",
  group: "7",
  courseName: mockCourse1.name,
  lecturer: "Ngoc Nquyen",
  week: "TP",
  courseType: "C",
  registrationName: mockCourse1.registrationName,
} satisfies ClassBlockProps;

const mockFootball = {
  startTime: "8:00",
  endTime: "9:30",
  group: "8",
  courseName: mockCourse2.name,
  lecturer: "Ziutek Ziutowski",
  week: "",
  courseType: "C",
  registrationName: mockCourse2.registrationName,
} satisfies ClassBlockProps;
const mockSpanish = {
  startTime: "21:00",
  endTime: "21:50",
  group: "9",
  courseName: mockCourse3.name,
  lecturer: "Szefuncio",
  week: "",
  courseType: "C",
  registrationName: mockCourse3.registrationName,
} satisfies ClassBlockProps;

const mockVoleyball1 = {
  startTime: "10:00",
  endTime: "11:30",
  group: "10",
  courseName: mockCourse4.name,
  lecturer: "Nauczyciel test",
  week: "",
  courseType: "C",
  registrationName: mockCourse4.registrationName,
} satisfies ClassBlockProps;

const mockVoleyball2 = {
  startTime: "18:00",
  endTime: "21:30",
  group: "11",
  courseName: mockCourse4.name,
  lecturer: "Nauczyciel test",
  week: "",
  courseType: "C",
  registrationName: mockCourse4.registrationName,
} satisfies ClassBlockProps;
const mondaySchedule = [
  mockL,
  mockW,
  mockS,
  mockC,
  mockP,
  mock1115,
  mock1610,
  mockFootball,
  mockSpanish,
  mockVoleyball1,
  mockVoleyball2,
];

const registrations = [mockRegistration1, mockRegistration2, mockRegistration3];
const mockCourses = [mockCourse1, mockCourse2, mockCourse3, mockCourse4];
const mockGroups = [
  mockL,
  mockW,
  mockS,
  mockC,
  mockP,
  mock1115,
  mock1610,
  mockFootball,
  mockSpanish,
  mockVoleyball1,
  mockVoleyball2,
];

export interface extendedCourse extends Course {
  isChecked: boolean;
}

export interface extendedGroup extends ClassBlockProps {
  isChecked: boolean;
}

const CreatePlan = () => {
  const [courses, setCourses] = useState<extendedCourse[]>(
    mockCourses.map((mockCourse) => ({ ...mockCourse, isChecked: false }))
  );
  const [groups, setGroups] = useState<extendedGroup[]>(
    mockGroups.map((mockGroup) => ({ ...mockGroup, isChecked: false }))
  );
  function checkCourse(id: string) {
    setCourses(
      courses.map((course) => (course.name === id ? { ...course, isChecked: !course.isChecked } : course))
    );
  }
  function checkGroup(id: string) {
    setGroups(
      groups.map((group) => (group.group === id ? { ...group, isChecked: !group.isChecked } : group))
    );
  }
  console.log(groups);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-center">Mój plan</h1>
      <div className="min-[1200px]:grid min-[1200px]:grid-cols-[1fr_4fr] border-b-primary border-b-4">
        <SelectGroups registrations={registrations} courses={courses} checkCourse={checkCourse} />
        <ScheduleTest schedule={mondaySchedule} courses={courses} groups={groups} onClick={checkGroup} />
      </div>
      <div className="flex gap-11 items-center justify-around">
        <Link href="/">Wróć do panelu głównego</Link>
        <span>Liczba ects: 4</span>
        <Link href="plans" className="font-semibold text-xl">
          Przejdź dalej
        </Link>
      </div>
    </div>
  );
};

export default CreatePlan;

import { ScheduleTest } from "@/components/schedule";
import { SelectGroups } from "@/components/selectGroups";
import Link from "next/link";
import { ClassBlockProps, Course, Registration } from "@/lib/types";
import { useState } from "react";
import Image from "next/image";
import { CiEdit } from "react-icons/ci";
import { IoMdArrowForward } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";

const Logo = () => {
  return (
    <a href="https://planer.solvro.pl/">
      <Image
        src="/assets/logo/solvro_white.png"
        alt="Logo Koła Naukowego Solvro"
        width={150}
        height={150}
        className="mx-auto cursor-pointer ml-20"
      />
    </a>
  );
};

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
  ects: 4,
} satisfies Course;

const mockCourse2 = {
  name: "Wykład X",
  registrationName: mockRegistration1.name,
  ects: 1,
} satisfies Course;

const mockCourse3 = {
  name: "Seminarium X",
  registrationName: mockRegistration2.name,
  ects: 5,
} satisfies Course;

const mockCourse4 = {
  name: "Cwiczenia X",
  registrationName: mockRegistration2.name,
  ects: 8,
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

export interface ExtendedCourse extends Course {
  isChecked: boolean;
}

export interface ExtendedGroup extends ClassBlockProps {
  isChecked: boolean;
}

const CreatePlan = () => {
  const [courses, setCourses] = useState<ExtendedCourse[]>(
    mockCourses.map((mockCourse) => ({ ...mockCourse, isChecked: false }))
  );
  const [groups, setGroups] = useState<ExtendedGroup[]>(
    mockGroups.map((mockGroup) => ({ ...mockGroup, isChecked: false }))
  );
  const checkCourse = (id: string) => {
    setCourses(
      courses.map((course) =>
        course.name === id
          ? { ...course, isChecked: !course.isChecked }
          : course
      )
    );
  };
  const checkGroup = (id: string) => {
    setGroups(
      groups.map((group) =>
        group.group === id ? { ...group, isChecked: !group.isChecked } : group
      )
    );
  };
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* <Navbar /> */}
      <div className="flex items-center min-h-20 max-h-20 bg-mainbutton5 gap-4">
        <div className="flex-none">
          <Logo />
        </div>
        <div className="flex-grow flex justify-center">
          <h1 className="flex items-center gap-2 p-2 md:px-14 text-sm md:text-3xl font-semibold text-center text-white border border-dashed rounded cursor-pointer">
            Mój plan <CiEdit />
          </h1>
        </div>
        <div className="hidden sm:block flex-none pr-4">
          <Image
            src="https://github.com/shadcn.png"
            width={40}
            height={40}
            className="rounded-full"
            alt="Picture of the author"
          />
        </div>
      </div>

      <div className="flex-grow min-[1200px]:grid min-[1200px]:grid-cols-[1fr_4fr] border-b-primary border-b-4">
        <SelectGroups
          registrations={registrations}
          courses={courses}
          checkCourse={checkCourse}
        />
        <ScheduleTest
          schedule={mondaySchedule}
          courses={courses}
          groups={groups}
          onClick={checkGroup}
        />
      </div>

      <div className="flex flex-row items-center justify-between bg-mainbutton3 text-white h-32 sm:h-14 text-sm sm:text-lg">
        <Link
          href="plans"
          className="h-14 flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-32 py-2 hover:bg-solvroshadow cursor-pointer w-1/2 transition-all hover:shadow-lg font-semibold"
        >
          <IoMdArrowBack size={20} className="block" />
          <span className="">Powrót do planów</span>
        </Link>

        <div className="flex-grow flex items-center justify-center text-sm text-center">
          <span>
            Liczba ects:{" "}
            {groups.reduce(
              (acc, curr) =>
                acc +
                (curr.isChecked
                  ? courses.find((course) => course.name === curr.courseName)
                      ?.ects ?? 0
                  : 0),
              0
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreatePlan;

import { useAtom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";

import { SolvroLogo } from "@/components/SolvroLogo";
import { ScheduleTest } from "@/components/schedule";
import { SelectGroups } from "@/components/selectGroups";
import type { ClassBlockProps, Course, Registration } from "@/lib/types";

import { plansAtom } from "../plans";

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

export const planFamily = atomFamily(
  ({ id }: { id: number }) =>
    atomWithStorage(`${id}-plan`, {
      id,
      name: `Nowy plan - ${id}`,
      courses: mockCourses.map((mockCourse) => ({
        ...mockCourse,
        isChecked: false,
      })),
      groups: mockGroups.map((mockGroup) => ({
        ...mockGroup,
        isChecked: false,
      })),
    }),
  (a, b) => a.id === b.id,
);

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = (async (context) => {
  const { id } = context.query;

  if (typeof id !== "string") {
    throw new Error(`Invalid id ${id?.toString()}`);
  }

  const planId = parseInt(id);

  return { props: { planId } };
}) satisfies GetServerSideProps<{ planId: number }>;

const CreatePlan = ({
  planId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [plan, setPlan] = useAtom(planFamily({ id: planId }));

  //tutaj używam atomu z widoku planow, zeby poprawnie aktualizowaly się nazwy
  const [plansTitles, setPlansTitles] = useAtom(plansAtom);

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const changePlanName = (newName: string) => {
    setPlan({
      ...plan,
      name: newName,
    });
    setPlansTitles(
      plansTitles.map((openedPlan) =>
        openedPlan.id === planId
          ? {
              ...openedPlan,
              name: newName,
            }
          : openedPlan,
      ),
    );
  };

  const checkCourse = (id: string) => {
    setPlan({
      ...plan,
      courses: plan.courses.map((course) =>
        course.name === id
          ? { ...course, isChecked: !course.isChecked }
          : course,
      ),
    });
  };
  const checkGroup = (id: string) => {
    setPlan({
      ...plan,
      groups: plan.groups.map((group) =>
        group.group === id ? { ...group, isChecked: !group.isChecked } : group,
      ),
    });
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* <Navbar /> */}
      <div className="flex max-h-20 min-h-20 items-center justify-between bg-mainbutton5">
        <div className="ml-4 w-1/4 flex-none">
          <SolvroLogo />
        </div>
        <div className="flex items-center justify-center rounded-xl bg-mainbutton2 p-1.5 text-lg font-semibold md:text-3xl">
          <input
            type="text"
            value={plan.name}
            onChange={(e) => {
              changePlanName(e.target.value);
            }}
            className={`w-full truncate border-mainbutton5 bg-transparent outline-none duration-100 ease-in-out before:transition-all ${
              isEditing ? "border-b-2 font-normal" : " "
            }`}
            disabled={!isEditing}
          />
          <CiEdit
            className="ml-2 transform cursor-pointer transition-transform hover:scale-110 active:scale-90"
            onClick={handleEditClick}
          />
        </div>
        <div className="mr-4 flex w-1/4 justify-end">
          <Image
            src="https://github.com/shadcn.png"
            width={40}
            height={40}
            className="rounded-full"
            alt="Picture of the author"
          />
        </div>
      </div>

      <div className="flex-grow border-b-4 border-b-primary min-[1200px]:grid min-[1200px]:grid-cols-[1fr_4fr]">
        <SelectGroups
          registrations={registrations}
          courses={plan.courses}
          checkCourse={checkCourse}
        />
        <ScheduleTest
          schedule={mondaySchedule}
          courses={plan.courses}
          groups={plan.groups}
          onClick={checkGroup}
        />
      </div>

      <div className="flex h-32 flex-row items-center justify-between bg-mainbutton3 text-sm text-white sm:h-14 sm:text-lg">
        <Link
          href="/plans"
          className="flex h-32 w-1/2 cursor-pointer items-center justify-center gap-2 px-2 py-2 font-semibold transition-all hover:bg-solvroshadow hover:shadow-lg sm:h-14 sm:gap-4 sm:px-32"
        >
          <IoMdArrowBack size={20} className="block" />
          <span className="">Powrót do planów</span>
        </Link>

        <div className="flex flex-grow items-center justify-center text-center text-sm">
          <span>
            Liczba ects:{" "}
            {plan.groups.reduce(
              (acc, curr) =>
                acc +
                (curr.isChecked
                  ? (plan.courses.find(
                      (course) => course.name === curr.courseName,
                    )?.ects ?? 0)
                  : 0),
              0,
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreatePlan;

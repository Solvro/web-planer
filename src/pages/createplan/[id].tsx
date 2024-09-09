import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import { IoCheckmarkOutline } from "react-icons/io5";

import { Seo } from "@/components/SEO";
import { ScheduleTest } from "@/components/Schedule";
import { SelectGroups } from "@/components/SelectGroups";
import { SolvroLogo } from "@/components/SolvroLogo";
import type {
  ClassBlockProps,
  Course,
  MockRegistration,
  Registration,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const fetchRegistrations = async (): Promise<MockRegistration[]> => {
  const res = await fetch(`/api/registrations`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json() as Promise<MockRegistration[]>;
};

export interface ExtendedCourse extends Course {
  isChecked: boolean;
}

export interface ExtendedGroup extends ClassBlockProps {
  isChecked: boolean;
}

export const planFamily = atomFamily(
  ({ id }: { id: number }) =>
    atomWithStorage(
      `${id}-plan`,
      {
        id,
        name: `Nowy plan - ${id}`,
        courses: [] as ExtendedCourse[],
        groups: [] as ExtendedGroup[],
      },
      undefined,
      { getOnInit: true },
    ),
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
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: registrations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["registrations"],
    queryFn: fetchRegistrations,
  });

  if (registrations && plan.courses.length === 0 && plan.groups.length === 0) {
    const courses = registrations
      .flatMap((reg) => reg.courses)
      .map((course) => ({
        ...course,
        isChecked: false,
      }));

    const groups = registrations
      .flatMap((reg) => reg.groups)
      .map((group) => ({
        ...group,
        isChecked: false,
      }));

    setPlan((prevPlan) => ({
      ...prevPlan,
      courses,
      groups,
    }));
  }

  const changePlanName = (newName: string) => {
    void window.umami.track("Change plan name");
    setPlan({
      ...plan,
      name: newName,
    });
  };

  const checkCourse = (id: string) => {
    void window.umami.track("Check course");
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
    void window.umami.track("Change group");
    setPlan({
      ...plan,
      groups: plan.groups.map((group) =>
        group.group === id ? { ...group, isChecked: !group.isChecked } : group,
      ),
    });
  };

  return (
    <>
      <Seo
        pageTitle={`${
          plan.name.length === 0 ? "Plan bez nazwy" : plan.name
        } | Kreator planu`}
      />
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        <div className="flex max-h-20 min-h-20 items-center justify-between bg-mainbutton5">
          <div className="ml-4 w-1/4 flex-none">
            <SolvroLogo />
          </div>
          <div className="flex items-center justify-center rounded-xl bg-mainbutton2 p-1.5 text-lg font-semibold md:text-3xl">
            <form
              className="flex items-center justify-center"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                changePlanName(formData.get("name")?.toString() ?? "");
                inputRef.current?.blur();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className={cn(
                  "w-full truncate border-mainbutton5 bg-transparent outline-none duration-100 ease-in-out before:transition-all focus:border-b-2 focus:font-normal",
                )}
                name="name"
                id="name"
                defaultValue={plan.name}
                onFocus={() => {
                  setIsEditing(true);
                }}
                onBlur={(e) => {
                  setIsEditing(false);
                  changePlanName(e.currentTarget.value);
                }}
              />
              {isEditing ? (
                <button type="submit" className="ml-2">
                  <IoCheckmarkOutline />
                </button>
              ) : (
                <label htmlFor="name" className="ml-2 cursor-pointer">
                  <span className="sr-only">Nazwa planu</span>
                  <CiEdit />
                </label>
              )}
            </form>
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
            registrations={
              registrations?.flatMap((reg) => reg.registration) ?? []
            }
            courses={plan.courses}
            checkCourse={checkCourse}
          />
          <ScheduleTest
            schedule={plan.groups}
            courses={plan.courses}
            groups={plan.groups}
            onClick={checkGroup}
          />
        </div>

        <div className="flex flex-row flex-nowrap items-center justify-between bg-mainbutton3 text-sm text-white">
          <Link
            href="/plans"
            data-umami-event="Back to plans"
            className="flex w-1/2 cursor-pointer items-center justify-center gap-2 p-2 font-semibold transition-all hover:bg-solvroshadow hover:shadow-lg"
          >
            <IoMdArrowBack size={20} className="block" />
            <span className="text-nowrap">Powrót do planów</span>
          </Link>

          <div className="flex w-1/2 flex-grow items-center justify-center text-center text-sm">
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
    </>
  );
};

export default CreatePlan;

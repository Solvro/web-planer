import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import type { ApiFacultyDataGet } from "@/app/api/data/[facultyId]/route";
import { ClassSchedule } from "@/components/ClassSchedule";
import { PlanDisplayLink } from "@/components/PlanDisplayLink";
import { Seo } from "@/components/SEO";
import { SelectGroups } from "@/components/SelectGroups";
import { SolvroLogo } from "@/components/SolvroLogo";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { encodeToBase64 } from "@/lib/sharingUtils";
import type { ClassBlockProps, Course } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Frequency, LessonType } from "@/services/usos/types";

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
        courses: [] as Course[],
        groups: [] as ExtendedGroup[],
      },
      undefined,
      { getOnInit: true },
    ),
  (a, b) => a.id === b.id,
);

const faculties = [
  {
    name: "Studium Języków Obcych [PRD/S1]",
    value: "PRD/S1",
  },
  {
    name: "Studium Wychowania Fizycznego i Sportu [PRD/S3]",
    value: "PRD/S3",
  },
  {
    name: "Politechnika Wrocławska [PWR]",
    value: "PWR",
  },
  {
    name: "Wydział Architektury [W1]",
    value: "W1",
  },
  {
    name: "Wydział Budownictwa Lądowego i Wodnego [W2]",
    value: "W2",
  },
  {
    name: "Wydział Chemiczny [W3]",
    value: "W3",
  },
  {
    name: "Wydział Informatyki i Telekomunikacji [W4N]",
    value: "W4N",
  },
  {
    name: "Wydział Elektryczny [W5]",
    value: "W5",
  },
  {
    name: "Wydział Geoinżynierii, Górnictwa i Geologii [W6]",
    value: "W6",
  },
  {
    name: "Wydział Zarządzania [W8N]",
    value: "W8N",
  },
  {
    name: "Wydział Mechaniczno-Energetyczny [W9]",
    value: "W9",
  },
  {
    name: "Wydział Mechaniczny [W10]",
    value: "W10",
  },
  {
    name: "Wydział Podstawowych Problemów Techniki [W11]",
    value: "W11",
  },
  {
    name: "Wydział Elektroniki, Fotoniki i Mikrosystemów [W12N]",
    value: "W12N",
  },
  {
    name: "Wydział Matematyki [W13]",
    value: "W13",
  },
  {
    name: "Filia w Legnicy [FLG]",
    value: "FLG",
  },
];

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

  const inputRef = useRef<HTMLInputElement>(null);

  const [faculty, setFaculty] = useState<string | null>(null);

  const data = useQuery({
    enabled: faculty !== null,
    queryKey: ["registrations", faculty],
    queryFn: async () => {
      const response = await fetch(`/api/data/${faculty}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<ApiFacultyDataGet>;
    },
  });

  const allCourses =
    data.data?.registrations.flatMap((r) =>
      r.courses.flatMap((c) => ({
        id: c.course.id,
        name: c.course.name,
        isChecked: plan.courses.some((p) => p.id === c.course.id),
        registrationId: r.registration.id,
      })),
    ) ?? [];

  const allRegistrations =
    data.data?.registrations.map((r) => ({
      name: r.registration.description.pl,
      id: r.registration.id,
    })) ?? [];

  const changePlanName = (newName: string) => {
    void window.umami?.track("Change plan name");
    setPlan({
      ...plan,
      name: newName,
    });
  };

  const checkCourse = (courseId: string) => {
    void window.umami?.track("Check course");

    const isAlreadyChecked = plan.courses.some((c) => c.id === courseId);

    setPlan({
      ...plan,
      courses: isAlreadyChecked
        ? plan.courses.filter((c) => c.id !== courseId)
        : [
            ...plan.courses,
            {
              id: allCourses.find((c) => c.id === courseId)?.id ?? "",
              name: allCourses.find((c) => c.id === courseId)?.name ?? "",
              registrationId: courseId,
            },
          ],
      groups: isAlreadyChecked
        ? plan.groups.filter((g) => g.courseId === courseId)
        : [
            ...plan.groups,
            ...allCourses
              .filter((c) => c.id === courseId)
              .flatMap(
                (c) =>
                  data.data?.registrations
                    .find((r) => r.registration.id === c.registrationId)
                    ?.courses.find((cc) => cc.course.id === c.id)
                    ?.groups.map(
                      (g) =>
                        ({
                          courseId: c.id,
                          courseName: c.name,
                          isChecked: false,
                          courseType:
                            g.type === LessonType.EXERCISES
                              ? "C"
                              : g.type === LessonType.LABORATORY
                                ? "L"
                                : g.type === LessonType.PROJECT
                                  ? "P"
                                  : g.type === LessonType.SEMINAR
                                    ? "S"
                                    : "W",
                          groupId: g.groupNumber.toString(),

                          lecturer: g.person,
                          registrationId: c.registrationId,
                          week:
                            g.frequency === Frequency.EVEN
                              ? "TP"
                              : g.frequency === Frequency.ODD
                                ? "TN"
                                : "",
                          endTime: `${g.hourEndTime.hours}:${g.hourEndTime.minutes}`,
                          startTime: `${g.hourStartTime.hours}:${g.hourStartTime.minutes}`,
                        }) satisfies ExtendedGroup,
                    ) ?? [],
              ),
          ],
    });
  };

  const checkGroup = (id: string) => {
    void window.umami?.track("Change group");
    setPlan({
      ...plan,
      groups: plan.groups.map((group) =>
        group.groupId === id
          ? { ...group, isChecked: !group.isChecked }
          : group,
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
      <div className="flex min-h-screen flex-col items-center gap-3 overflow-x-hidden">
        <div className="flex max-h-20 min-h-20 w-full items-center justify-between bg-mainbutton7">
          <div className="ml-4 flex items-center gap-2 text-2xl font-bold text-white md:w-1/4">
            <SolvroLogo />
            <div className="md:hidden">Kreator</div>
          </div>
          <div className="hidden w-1/2 items-center justify-center font-bold text-white md:flex md:text-4xl">
            Kreator
          </div>
          <div className="mr-4 flex w-1/4 items-center justify-end">
            <Link
              href="/plans"
              data-umami-event="Back to plans"
              className={cn(buttonVariants({ variant: "link" }), "text-white")}
            >
              <span className="text-nowrap">Moje plany</span>
            </Link>
            <Image
              src="https://github.com/shadcn.png"
              width={40}
              height={40}
              className="rounded-full"
              alt="Picture of the author"
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:items-start">
          <div className="flex w-9/12 max-w-[400px] flex-col items-center justify-center gap-2 md:ml-4 md:w-4/12 md:flex-col">
            <div className="w-full rounded-xl border-2 p-5">
              <div className="flex flex-col justify-start gap-3 md:w-full">
                <div className="flex w-full">
                  <form
                    className="flex w-full items-center justify-center"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      changePlanName(formData.get("name")?.toString() ?? "");
                      inputRef.current?.blur();
                    }}
                  >
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="name">Nazwa</Label>
                      <Input
                        ref={inputRef}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Wolne poniedziałki"
                        defaultValue={
                          typeof window === "undefined" ? "" : plan.name
                        }
                        onChange={(e) => {
                          changePlanName(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </form>
                </div>

                <div className="flex w-full items-center justify-between gap-1 md:flex-col lg:flex-row">
                  <PlanDisplayLink
                    hash={encodeToBase64(JSON.stringify(plan))}
                  />
                </div>
              </div>
            </div>
            <Select
              onValueChange={(v) => {
                setFaculty(v);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wydział" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-full items-center justify-center">
              <SelectGroups
                registrations={allRegistrations}
                courses={allCourses}
                checkCourse={checkCourse}
              />
            </div>
          </div>
          <hr />
          <div className="flex w-11/12 items-start overflow-x-auto md:ml-0">
            <div className="overflow-x flex flex-col gap-3 overflow-auto scrollbar-thin scrollbar-track-sky-300 scrollbar-thumb-sky-900">
              {/* {/* <ClassSchedule
                schedule={schedule}
                day="Poniedziałek"
                courses={courses}
                groups={groups}
                onClick={onClick}
              /> */}
              <ClassSchedule
                schedule={plan.groups}
                day="Wtorek"
                courses={plan.courses.map((c) => ({
                  ...c,
                  isChecked: true,
                }))}
                groups={plan.groups}
                onClick={checkGroup}
              />
              {/* <ClassSchedule
                schedule={schedule}
                day="Środa"
                courses={courses}
                groups={groups}
                onClick={onClick}
              />
              <ClassSchedule
                schedule={schedule}
                day="Czwartek"
                courses={courses}
                groups={groups}
                onClick={onClick}
              />
              <ClassSchedule
                schedule={schedule}
                day="Piątek"
                courses={courses}
                groups={groups}
                onClick={onClick}
              /> */}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-1 items-center justify-center bg-mainbutton7 p-2">
          <p className="text-center text-white">
            Made with ❤️ by{" "}
            <a
              href="https://solvro.pwr.edu.pl/"
              className="font-bold text-mainbutton hover:underline"
            >
              SOLVRO
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default CreatePlan;

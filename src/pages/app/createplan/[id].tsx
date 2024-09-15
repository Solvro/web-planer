import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import type { ApiFacultyDataGet } from "@/app/api/data/[facultyId]/route";
import { type ExtendedGroup, planFamily } from "@/atoms/planFamily";
import { ClassSchedule } from "@/components/ClassSchedule";
import { PlanDisplayLink } from "@/components/PlanDisplayLink";
import { RegistrationCombobox } from "@/components/RegistrationCombobox";
import { Seo } from "@/components/SEO";
import { SelectCourses } from "@/components/SelectGroups";
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
import { Skeleton } from "@/components/ui/skeleton";
import { encodeToBase64 } from "@/lib/sharingUtils";
import { cn } from "@/lib/utils";
import { Day, Frequency, LessonType } from "@/services/usos/types";

const faculties = [
  {
    name: "[PRD/S1] Studium Języków Obcych",
    value: "PRD/S1",
  },
  {
    name: "[PRD/S3] Studium Wychowania Fizycznego i Sportu",
    value: "PRD/S3",
  },
  {
    name: "[W1] Wydział Architektury",
    value: "W1",
  },
  {
    name: "[W2] Wydział Budownictwa Lądowego i Wodnego",
    value: "W2",
  },
  {
    name: "[W3] Wydział Chemiczny",
    value: "W3",
  },
  {
    name: "[W4N] Wydział Informatyki i Telekomunikacji",
    value: "W4N",
  },
  {
    name: "[W5] Wydział Elektryczny",
    value: "W5",
  },
  {
    name: "[W6] Wydział Geoinżynierii, Górnictwa i Geologii",
    value: "W6",
  },
  {
    name: "[W8N] Wydział Zarządzania",
    value: "W8N",
  },
  {
    name: "[W9] Wydział Mechaniczno-Energetyczny",
    value: "W9",
  },
  {
    name: "[W10] Wydział Mechaniczny",
    value: "W10",
  },
  {
    name: "[W11] Wydział Podstawowych Problemów Techniki",
    value: "W11",
  },
  {
    name: "[W12N] Wydział Elektroniki, Fotoniki i Mikrosystemów",
    value: "W12N",
  },
  {
    name: "[W13] Wydział Matematyki",
    value: "W13",
  },
  {
    name: "[FLG] Filia w Legnicy",
    value: "FLG",
  },
  {
    name: "[PWR] Politechnika Wrocławska",
    value: "PWR",
  },
];

const lessonTypeToName = (lessonType: LessonType) => {
  switch (lessonType) {
    case LessonType.EXERCISES:
      return "Ć";
    case LessonType.LABORATORY:
      return "L";
    case LessonType.PROJECT:
      return "P";
    case LessonType.SEMINAR:
      return "S";
    case LessonType.LECTURE:
      return "W";
    default:
      return "";
  }
};

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
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<
    string | null
  >(null);
  const data = useQuery({
    enabled: faculty !== null,
    queryKey: ["registrations", faculty],
    queryFn: async () => {
      const response = await fetch(
        `/api/data/${encodeURIComponent(faculty ?? "")}`,
      );

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
        type: lessonTypeToName(c.groups.at(0)?.type ?? ("" as LessonType)),
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
              type: allCourses.find((c) => c.id === courseId)?.type ?? "",
            },
          ],
      groups: isAlreadyChecked
        ? plan.groups.filter((g) => g.courseId !== courseId)
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
                          groupNumber: g.groupNumber.toString(),
                          groupId: g.groupNumber + g.courseId + g.type,
                          day: g.day,
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
          <div className="flex w-full max-w-[350px] flex-col items-center justify-center gap-2 px-2 md:ml-4 md:w-4/12 md:flex-col">
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
              <SelectTrigger className="pl-2" isLoading={data.isLoading}>
                <SelectValue placeholder="Wydział" />
              </SelectTrigger>
              <SelectContent className="max-w-full">
                {faculties.map((f) => (
                  <SelectItem
                    className="mr-2 max-w-full truncate"
                    key={f.value}
                    value={f.value}
                  >
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {data.isLoading ? (
              <Skeleton className="h-[40px] w-full rounded-sm" />
            ) : allRegistrations.length > 0 ? (
              <RegistrationCombobox
                registrations={allRegistrations.map((r) => ({
                  value: r.id,
                  label: r.name,
                }))}
                selectedRegistrationId={selectedRegistrationId}
                setSelectedRegistrationId={setSelectedRegistrationId}
              />
            ) : null}

            <div className="w-full items-center justify-center">
              <SelectCourses
                registrations={allRegistrations.filter(
                  (r) =>
                    r.id === selectedRegistrationId ||
                    plan.courses.some((c) => c.registrationId === r.id),
                )}
                courses={allCourses.filter(
                  (c) =>
                    c.registrationId === selectedRegistrationId ||
                    plan.courses.some((course) => c.id === course.id),
                )}
                checkCourse={checkCourse}
              />
            </div>
          </div>
          <hr />
          <div className="ml-2 flex w-full items-start overflow-x-auto md:ml-0">
            <div className="overflow-x flex flex-col gap-3 overflow-auto scrollbar-thin scrollbar-track-sky-300 scrollbar-thumb-sky-900">
              {[
                { day: Day.MONDAY, label: "Poniedziałek" },
                { day: Day.TUESDAY, label: "Wtorek" },
                { day: Day.WEDNESDAY, label: "Środa" },
                { day: Day.THURSDAY, label: "Czwartek" },
                { day: Day.FRIDAY, label: "Piątek" },
              ].map(({ day, label }) => (
                <ClassSchedule
                  key={day}
                  day={label}
                  groups={plan.groups.filter((g) => g.day === day)}
                  onSelectGroup={checkGroup}
                />
              ))}
              {[
                { day: Day.SATURDAY, label: "Sobota" },
                { day: Day.SUNDAY, label: "Niedziela" },
              ].map(
                ({ day, label }) =>
                  plan.groups.some((g) => g.day === day) && (
                    <ClassSchedule
                      key={day}
                      day={label}
                      groups={plan.groups.filter((g) => g.day === day)}
                      onSelectGroup={checkGroup}
                    />
                  ),
              )}
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

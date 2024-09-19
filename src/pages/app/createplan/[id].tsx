import { useQuery } from "@tanstack/react-query";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRef, useState } from "react";

import type { ApiFacultyDataGet } from "@/app/api/data/[facultyId]/route";
import { type ExtendedGroup } from "@/atoms/planFamily";
import { ClassSchedule } from "@/components/ClassSchedule";
import { GroupsAccordionItem } from "@/components/GroupsAccordion";
import { PlanDisplayLink } from "@/components/PlanDisplayLink";
import { RegistrationCombobox } from "@/components/RegistrationCombobox";
import { Seo } from "@/components/SEO";
import { SolvroLogo } from "@/components/SolvroLogo";
import { Accordion } from "@/components/ui/accordion";
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
import { usePlan } from "@/lib/usePlan";
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

  return { props: { planId: id } };
}) satisfies GetServerSideProps<{ planId: string }>;

const registrationReplacer = (name: string) => {
  const newName = name
    .replace("W04 zapisy wydziałowe dla kierunku", "")
    .replace("zapisy wydziałowe na ", "")
    .replace("W04 ", "")
    .replace("2024/25-Z", "")
    .trim();
  return newName.charAt(0).toUpperCase() + newName.slice(1);
};

const CreatePlan = ({
  planId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const plan = usePlan({
    planId,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [faculty, setFaculty] = useState<string | null>(null);
  const registrations = useQuery({
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
    select: (d) => d.registrations,
  });

  const allRegistrations =
    registrations.data
      ?.map((r) => ({
        name: registrationReplacer(r.registration.description.pl),
        id: r.registration.id,
        courses: r.courses.map((c) => ({
          id: c.course.id,
          name: c.course.name,
          isChecked: false,
          registrationId: r.registration.id,
          type: lessonTypeToName(c.groups.at(0)?.type ?? ("" as LessonType)),
          groups: c.groups.map(
            (g) =>
              ({
                groupId: g.groupNumber + c.course.id + g.type,
                groupNumber: g.groupNumber.toString(),
                courseId: c.course.id,
                courseName: c.course.name,
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
                day: g.day,
                lecturer: g.person,
                registrationId: r.registration.id,
                week:
                  g.frequency === Frequency.EVEN
                    ? "TP"
                    : g.frequency === Frequency.ODD
                      ? "TN"
                      : "",
                endTime: `${g.hourEndTime.hours}:${g.hourEndTime.minutes}`,
                startTime: `${g.hourStartTime.hours}:${g.hourStartTime.minutes}`,
              }) satisfies ExtendedGroup,
          ),
        })),
      }))
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      }) ?? [];

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
              href="/app/plans"
              data-umami-event="Back to plans"
              className={cn(buttonVariants({ variant: "link" }), "text-white")}
            >
              <span className="text-nowrap">Moje plany</span>
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:items-start">
          <div className="flex w-full max-w-[350px] flex-col items-center justify-center gap-2 px-2 md:ml-4 md:w-4/12 md:flex-col">
            <div className="flex flex-col justify-start gap-3 md:w-full">
              <div className="flex w-full items-end gap-2">
                <form
                  className="flex w-full items-center justify-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    plan.changeName(formData.get("name")?.toString() ?? "");
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
                        plan.changeName(e.currentTarget.value);
                      }}
                    />
                  </div>
                </form>
                <PlanDisplayLink id={plan.id} />
              </div>
            </div>

            <div className="w-full">
              <Label htmlFor="faculty">Wydział</Label>
              <Select
                name="faculty"
                onValueChange={(v) => {
                  setFaculty(v);
                }}
              >
                <SelectTrigger
                  className="pl-2"
                  isLoading={registrations.isLoading}
                >
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
            </div>
            {registrations.isLoading ? (
              <Skeleton className="h-[40px] w-full rounded-sm" />
            ) : allRegistrations.length > 0 ? (
              <div className="w-full">
                <Label htmlFor="registration">Rejestracja</Label>
                <RegistrationCombobox
                  name="registration"
                  registrations={allRegistrations.map((r) => ({
                    value: r.id,
                    label: r.name,
                  }))}
                  selectedRegistrations={plan.registrations.map((r) => r.id)}
                  onSelect={(registrationId) => {
                    const registration = allRegistrations.find(
                      (r) => r.id === registrationId,
                    );
                    if (registration === undefined) {
                      return;
                    }

                    if (
                      plan.registrations.some((r) => r.id === registration.id)
                    ) {
                      plan.removeRegistration(registration.id);
                    } else {
                      plan.addRegistration(registration, registration.courses);
                    }
                  }}
                />
              </div>
            ) : allRegistrations.length === 0 ? (
              <div className="w-full items-center justify-center">
                <p className="text-center">Brak rejestracji</p>
              </div>
            ) : null}

            <div className="w-full items-center justify-center">
              <div className="w-full overflow-auto">
                <Accordion type="single" collapsible={true}>
                  {plan.registrations.map((registration) => (
                    <GroupsAccordionItem
                      key={registration.id}
                      registrationName={registration.name}
                      onCourseCheck={(courseId) => {
                        plan.selectCourse(courseId);
                      }}
                      onDelete={() => {
                        plan.removeRegistration(registration.id);
                      }}
                      onCheckAll={(isChecked) => {
                        plan.checkAllCourses(registration.id, isChecked);
                      }}
                      courses={plan.courses.filter(
                        (c) => c.registrationId === registration.id,
                      )}
                    />
                  ))}
                </Accordion>
              </div>
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
                  selectedGroups={plan.allGroups.filter((g) => g.isChecked)}
                  groups={plan.allGroups.filter((g) => g.day === day)}
                  onSelectGroup={(groupdId) => {
                    plan.selectGroup(groupdId);
                  }}
                />
              ))}
              {[
                { day: Day.SATURDAY, label: "Sobota" },
                { day: Day.SUNDAY, label: "Niedziela" },
              ].map(
                ({ day, label }) =>
                  plan.allGroups.some((g) => g.day === day) && (
                    <ClassSchedule
                      key={day}
                      day={label}
                      selectedGroups={plan.allGroups.filter((g) => g.isChecked)}
                      groups={plan.allGroups.filter((g) => g.day === day)}
                      onSelectGroup={(groupdId) => {
                        plan.selectGroup(groupdId);
                      }}
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

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";

import type { ApiFacultyDataGet } from "@/app/api/data/[facultyId]/route";
import { type ExtendedGroup } from "@/atoms/planFamily";
import { ClassSchedule } from "@/components/ClassSchedule";
import { GroupsAccordionItem } from "@/components/GroupsAccordion";
import { PlanDisplayLink } from "@/components/PlanDisplayLink";
import { RegistrationCombobox } from "@/components/RegistrationCombobox";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
import { faculties, lessonTypeToName } from "@/constants";
import { usePlan } from "@/lib/usePlan";
import { registrationReplacer } from "@/lib/utils";
import { Day, Frequency, LessonType } from "@/services/usos/types";

export function CreateNewPlanPage({ planId }: { planId: string }) {
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
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 py-3 md:flex-row md:items-start">
      <div className="flex w-full max-w-[350px] flex-col items-center justify-center gap-2 px-2 md:ml-4 md:w-4/12 md:flex-col">
        <div className="flex flex-col justify-start gap-3 md:w-full">
          <div className="flex w-full items-end gap-2">
            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                className="aspect-square"
                size="icon"
                asChild={true}
              >
                <Link href="/plans">
                  <MdArrowBack size={20} />
                </Link>
              </Button>
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
            </div>
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
            <SelectTrigger className="pl-2" disabled={registrations.isLoading}>
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

                if (plan.registrations.some((r) => r.id === registration.id)) {
                  plan.removeRegistration(registration.id);
                } else {
                  plan.addRegistration(registration, registration.courses);
                }
              }}
            />
          </div>
        ) : allRegistrations.length === 0 ? (
          <div className="w-full items-center justify-center">
            <p className="text-center">Brak wybranych</p>
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
  );
}

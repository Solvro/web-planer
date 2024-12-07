"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { toast } from "sonner";

import { createNewPlan, updatePlan } from "@/actions/plans";
import type { ExtendedCourse, ExtendedGroup } from "@/atoms/planFamily";
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
import { env } from "@/env.mjs";
import { usePlan } from "@/lib/usePlan";
import { registrationReplacer } from "@/lib/utils";
import type { LessonType } from "@/services/usos/types";
import { Day } from "@/services/usos/types";

import { SyncedButton } from "./SyncedButton";

type CourseType = Array<{
  id: string;
  name: string;
  registrationId: string;
  groups: Array<{
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    group: string;
    lecturer: string;
    week: "-" | "TN" | "TP";
    day: Day;
    type: "C" | "L" | "P" | "S" | "W";
    url: string;
    courseId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}>;

type FacultyType = Array<{ id: string; name: string; departmentId: string }>;

export function CreateNewPlanPage({
  planId,
  faculties,
}: {
  planId: string;
  faculties: Array<{ name: string; value: string }>;
}) {
  const [syncing, setSyncing] = useState(false);
  const firstTime = useRef(true);

  const plan = usePlan({
    planId,
  });

  const handleCreateOnlinePlan = async () => {
    firstTime.current = false;
    const res = await createNewPlan({ name: plan.name });
    if (res === false) {
      return toast.error("Nie udało się utworzyć planu");
    }
    plan.setOnlineId(res.schedule.id.toString());
    toast.success("Utworzono plan");
    return true;
  };

  const handleSyncPlan = async () => {
    setSyncing(true);
    try {
      const res = await updatePlan({
        id: Number(plan.onlineId),
        name: plan.name,
        courses: plan.courses
          .filter((c) => c.isChecked)
          .map((c) => ({ id: c.id })),
        registrations: plan.registrations.map((r) => ({ id: r.id })),
        groups: plan.allGroups
          .filter((g) => g.isChecked)
          .map((g) => ({ id: g.groupOnlineId })),
      });
      if (res === false) {
        return toast.error("Nie udało się zaktualizować planu");
      }
      toast.success("Zaktualizowano plan");
      plan.setSynced(true);
      return true;
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (plan.onlineId === null && firstTime.current) {
      void handleCreateOnlinePlan();
    }
  }, [plan]);

  // useEffect(() => {
  //   if (!plan.synced && plan.onlineId !== null && !firstTime.current) {
  //     void handleUpdatePlan();
  //   }
  // }, [plan.onlineId, plan.synced, firstTime]);

  const inputRef = useRef<HTMLInputElement>(null);

  const [faculty, setFaculty] = useState<string | null>(null);
  const registrations = useQuery({
    enabled: faculty !== null,
    queryKey: ["registrations", faculty],
    queryFn: async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/departments/${faculty}/registrations`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<FacultyType>;
    },
  });

  const coursesFn = useMutation({
    mutationKey: ["courses"],
    mutationFn: async (registrationId: string) => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/departments/${faculty}/registrations/${encodeURIComponent(registrationId)}/courses`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<CourseType>;
    },
  });

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-5 py-3 md:flex-row md:items-start">
      <div className="flex max-h-screen w-full flex-none flex-col items-center justify-center gap-2 px-2 md:ml-4 md:w-[350px] md:flex-col">
        <div className="flex flex-col justify-start gap-3 md:w-full">
          <div className="flex w-full items-end gap-1">
            <div className="flex items-end gap-1">
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
            <SyncedButton
              synced={plan.synced}
              onlineId={plan.onlineId}
              syncing={syncing}
              onClick={handleSyncPlan}
            />
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
                  {registrationReplacer(f.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {registrations.isLoading ? (
          <Skeleton className="h-[40px] w-full rounded-sm" />
        ) : registrations.data && registrations.data.length > 0 ? (
          <div className="w-full">
            <Label htmlFor="registration">Rejestracja</Label>
            <RegistrationCombobox
              name="registration"
              registrations={registrations.data.map((r) => ({
                value: r.id,
                label: registrationReplacer(r.name),
              }))}
              selectedRegistrations={plan.registrations.map((r) => r.id)}
              onSelect={(registrationId) => {
                const selectedRegistration = registrations.data.find(
                  (r) => r.id === registrationId,
                );
                if (selectedRegistration === undefined) {
                  return;
                }

                if (
                  plan.registrations.some(
                    (r) => r.id === selectedRegistration.id,
                  )
                ) {
                  plan.removeRegistration(selectedRegistration.id);
                } else {
                  coursesFn.mutate(selectedRegistration.id, {
                    onSuccess: (data) => {
                      const extendedCourses: ExtendedCourse[] = data
                        .map((c) => ({
                          id: c.id,
                          name: c.name,
                          isChecked: false,
                          registrationId: c.registrationId,
                          type: c.groups.at(0)?.type ?? ("" as LessonType),
                          groups: c.groups.map(
                            (g) =>
                              ({
                                groupId: g.group + c.id + g.type,
                                groupNumber: g.group.toString(),
                                groupOnlineId: g.id,
                                courseId: c.id,
                                courseName: c.name,
                                isChecked: false,
                                courseType: g.type,
                                day: g.day,
                                lecturer: g.lecturer,
                                registrationId: c.registrationId,
                                week: g.week.replace("-", "") as
                                  | ""
                                  | "TN"
                                  | "TP",
                                endTime: g.endTime
                                  .split(":")
                                  .slice(0, 2)
                                  .join(":"),
                                startTime: g.startTime
                                  .split(":")
                                  .slice(0, 2)
                                  .join(":"),
                              }) satisfies ExtendedGroup,
                          ),
                        }))
                        .sort((a, b) => {
                          return a.name.localeCompare(b.name);
                        });
                      plan.addRegistration(
                        selectedRegistration,
                        extendedCourses,
                      );
                    },
                  });
                }
              }}
            />
          </div>
        ) : registrations.data && registrations.data.length === 0 ? (
          <div className="w-full items-center justify-center">
            <p className="text-center">Brak wybranych</p>
          </div>
        ) : null}

        <div className="flex w-full flex-1 flex-col overflow-y-scroll">
          <Accordion type="single" collapsible={true}>
            {plan.registrations.map((registration) => (
              <GroupsAccordionItem
                key={registration.id}
                registrationName={registrationReplacer(registration.name)}
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
      <div className="ml-2 flex grow items-start overflow-x-scroll md:ml-0">
        <div className="flex flex-col gap-3">
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
              groups={plan.allGroups.filter(
                (g) => g.day.toLocaleLowerCase() === day,
              )}
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

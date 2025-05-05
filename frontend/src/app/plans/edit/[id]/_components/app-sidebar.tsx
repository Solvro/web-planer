"use client";

import { useQuery } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { isEqual } from "date-fns";
import { format } from "date-fns/format";
import Link from "next/link";
import React from "react";

import { getFaculties } from "@/actions/get-faculties";
import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import { GroupsAccordionItem } from "@/components/groups-accordion";
import { Icons } from "@/components/icons";
import { PlanDisplayLink } from "@/components/plan-display-link";
import { RegistrationCombobox } from "@/components/registration-combobox";
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
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchClient } from "@/lib/fetch";
import type { usePlanType } from "@/lib/use-plan";
import { registrationReplacer } from "@/lib/utils";
import type {
  CourseType,
  FacultyType,
  LessonType,
  PlanResponseType,
} from "@/types";

import { OfflineAlert } from "./offline-alert";
import { SyncErrorAlert } from "./sync-error-alert";
import { SyncedButton } from "./synced-button";

export function AppSidebar({
  plan,
  handleUpdateLocalPlan,
  handleSyncPlan,
  onlinePlan,
  syncing,
  setFaculty,
  coursesFunction,
  inputRef,
  offlineAlert,
  faculty,
  isLoggedIn,
}: {
  isLoggedIn: boolean;
  plan: usePlanType;
  handleUpdateLocalPlan: () => Promise<void>;
  handleSyncPlan: () => Promise<void>;
  onlinePlan: PlanResponseType | null | undefined;
  syncing: boolean;
  setFaculty: React.Dispatch<React.SetStateAction<string | null>>;
  coursesFunction: UseMutationResult<CourseType, Error, string>;
  inputRef: React.RefObject<HTMLInputElement>;
  offlineAlert: boolean;
  faculty: string | null;
}) {
  const faculties = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const registrations = useQuery({
    enabled: faculty !== null && faculty !== "",
    queryKey: ["registrations", faculty],
    queryFn: async () => {
      const response = await fetchClient({
        url: `/departments/${encodeURIComponent(faculty ?? "")}/registrations`,
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<FacultyType>;
    },
  });

  return (
    <Sidebar className="pt-20">
      <SidebarHeader />
      <SidebarContent>
        <div className="flex max-h-screen w-full flex-none flex-col items-center justify-center gap-2 px-2 md:ml-4 md:w-[350px] md:flex-col">
          {offlineAlert ? <OfflineAlert /> : null}
          {isLoggedIn && onlinePlan !== null ? (
            <SyncErrorAlert
              onlinePlan={onlinePlan}
              planDate={plan.updatedAt}
              downloadChanges={handleUpdateLocalPlan}
              sendChanges={handleSyncPlan}
            />
          ) : null}

          <div className="flex w-full flex-col justify-start gap-3">
            <div className="flex w-full items-end gap-1">
              <div className="flex w-full items-end gap-1">
                <Button
                  variant="outline"
                  className="aspect-square"
                  size="icon"
                  asChild={true}
                >
                  <Link href="/plans">
                    <Icons.ArrowBack size={20} />
                  </Link>
                </Button>
                <form
                  className="flex w-full items-center justify-center"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string
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
                      onChange={(event) => {
                        plan.changeName(event.currentTarget.value);
                      }}
                    />
                  </div>
                </form>
              </div>
              <SyncedButton
                plan={plan}
                isSyncing={syncing}
                isEqualsDates={isEqual(
                  plan.updatedAt,
                  new Date(
                    onlinePlan == null ? plan.updatedAt : onlinePlan.updatedAt,
                  ),
                )}
              />
              <PlanDisplayLink />
            </div>

            <p className="text-xs text-muted-foreground">
              Ostatnia aktualizacja online:{" "}
              {format(plan.updatedAt, "dd.MM.yyyy HH:mm")}
            </p>
          </div>

          <div className="w-full">
            <Label htmlFor="faculty" className="mb-1">
              Wydział
            </Label>
            <Select
              name="faculty"
              onValueChange={(v) => {
                setFaculty(v);
              }}
            >
              <SelectTrigger
                className="pl-2"
                disabled={registrations.isLoading}
              >
                <SelectValue placeholder="Wybierz swój wydział" />
              </SelectTrigger>
              {faculties.isLoading ? (
                <Skeleton className="h-[40px] w-full rounded-sm" />
              ) : (
                <SelectContent className="max-w-full">
                  {faculties.data?.map((f) => (
                    <SelectItem
                      className="mr-2 max-w-full truncate"
                      key={f.value}
                      value={f.value}
                    >
                      {registrationReplacer(f.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          </div>
          {registrations.isLoading ? (
            <Skeleton className="h-[40px] w-full rounded-sm" />
          ) : registrations.data !== undefined &&
            registrations.data.length > 0 ? (
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
                    coursesFunction.mutate(selectedRegistration.id, {
                      onSuccess: (data) => {
                        const extendedCourses: ExtendedCourse[] = data
                          .map((c) => ({
                            id: c.id,
                            name: c.name,
                            isChecked: true,
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
                                  spotsOccupied: g.spotsOccupied,
                                  spotsTotal: g.spotsTotal,
                                  averageRating: g.averageRating,
                                  opinionsCount: g.opinionsCount,
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
          ) : registrations.data !== undefined &&
            registrations.data.length === 0 ? (
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
      </SidebarContent>
    </Sidebar>
  );
}

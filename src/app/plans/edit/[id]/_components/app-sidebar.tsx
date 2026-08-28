"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isEqual } from "date-fns";
import { format } from "date-fns/format";
import React, { useEffect } from "react";

import { getFacultiesAction } from "@/actions/v2/get-faculties";
import { getFacultyRegistrationsAction } from "@/actions/v2/get-faculty-registrations";
import { getRegistrationFacultyAction } from "@/actions/v2/get-registration-faculty";
import { Alerts } from "@/components/alerts";
import { AlgorithmDialog } from "@/components/algo-dialog";
import { GroupsAccordionItem } from "@/components/groups-accordion";
import { PlanDisplayLink } from "@/components/plan-display-link";
import { PlanOrientationButton } from "@/components/plan-orientation-button";
import { RegistrationCombobox } from "@/components/registration-combobox";
import { Accordion } from "@/components/ui/accordion";
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
import type { usePlanType } from "@/lib/use-plan";
import { registrationReplacer } from "@/lib/utils";
import { serverToLocalPlan } from "@/lib/utils/server-to-local-plan";
import type { CourseType, PlanResponseType } from "@/types";

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
  inputRef: React.RefObject<HTMLInputElement | null>;
  offlineAlert: boolean;
  faculty: string | null;
}) {
  const faculties = getFacultiesAction();

  const registrations = useQuery({
    enabled: faculty !== null && faculty !== "",
    queryKey: ["registrations", faculty],
    queryFn: async () => {
      const registrationsDTO = await getFacultyRegistrationsAction(
        faculty ?? "",
      );

      return registrationsDTO.map((registrationDTO) => {
        return {
          id: registrationDTO.id,
          name: registrationDTO.description,
          departmentId: faculty ?? "W4N",
        };
      });
    },
  });

  const mergeRegistrationsWithOnline = () => {
    const returned: { label: string; value: string }[] = [];

    if (registrations.data !== undefined) {
      for (const registration of registrations.data) {
        returned.push({
          label: registrationReplacer(registration.name),
          value: registration.id,
        });
      }
    }

    for (const onlineRegistration of plan.registrations) {
      if (
        !returned.includes({
          value: onlineRegistration.id,
          label: registrationReplacer(onlineRegistration.name),
        })
      ) {
        returned.push({
          value: onlineRegistration.id,
          label: registrationReplacer(onlineRegistration.name),
        });
      }
    }

    return returned;
  };

  useEffect(() => {
    if (
      onlinePlan !== undefined &&
      onlinePlan !== null &&
      inputRef.current !== null
    ) {
      inputRef.current.value = onlinePlan.name;
    }
  }, [onlinePlan]);

  useEffect(() => {
    if (
      onlinePlan !== undefined &&
      onlinePlan !== null &&
      registrations.data !== undefined
    ) {
      (async () => {
        for (const r of onlinePlan.registrations) {
          const registrationData = await getRegistrationFacultyAction(r.id);
          registrations.data.push({
            id: r.id,
            departmentId: registrationData.faculty.id,
            name: registrationData.registrationDesc,
          });
        }
      })().catch((err) => {
        console.log(err);
      });
    }
  }, [onlinePlan, registrations.data]);

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

            <div className="flex items-center gap-2">
              <AlgorithmDialog
                availableCourses={plan.courses}
                planId={plan.id}
              />
              <PlanOrientationButton />
            </div>
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
              ) : faculties.isError ? (
                <SelectContent className="max-w-full">
                  <SelectItem
                    className="mr-2 max-w-full truncate text-red-500"
                    key="error"
                    value="error"
                    disabled={true}
                  >
                    Wystąpił błąd podczas ładowania wydziałów
                  </SelectItem>
                </SelectContent>
              ) : (
                <SelectContent className="max-w-full">
                  {faculties.data.map((f) => (
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
          ) : (registrations.data !== undefined &&
              registrations.data.length > 0) ||
            plan.registrations.length > 0 ? (
            <div className="w-full">
              <Label htmlFor="registration">Rejestracja</Label>
              <RegistrationCombobox
                name="registration"
                registrations={mergeRegistrationsWithOnline()}
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
                        const extendedCourses = serverToLocalPlan(
                          data,
                          true,
                          (_course, _group, _meeting) => false,
                        );
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
          ) : registrations.data?.length === 0 ? (
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
                  courses={plan.courses.filter((c) => {
                    console.log(c.registrationId, registration.id);
                    return c.registrationId === registration.id;
                  })}
                />
              ))}
            </Accordion>
          </div>
        </div>
      </SidebarContent>
      <Alerts className="mt-4 py-3 animate-in fade-in slide-in-from-left" />
    </Sidebar>
  );
}

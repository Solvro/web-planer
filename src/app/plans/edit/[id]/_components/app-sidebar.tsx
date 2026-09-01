"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { format, isEqual } from "date-fns";
import React, { useEffect } from "react";

import { FACULTIES } from "@/actions/v2/get-faculties";
import { getFacultyRegistrationsAction } from "@/actions/v2/get-faculty-registrations";
import { Alerts } from "@/components/alerts";
import { Icons } from "@/components/icons";
import { PlanDisplayLink } from "@/components/plan-display-link";
import { RegistrationCombobox } from "@/components/registration-combobox";
import { TopbarPortal } from "@/components/topbar-portal";
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
import type { usePlanType } from "@/lib/use-plan";
import { cn, registrationReplacer } from "@/lib/utils";
import {
  collidingGroupIds,
  detectCollisions,
} from "@/lib/utils/detect-collisions";
import { generateICSFile } from "@/lib/utils/generate-ics-file";
import { serverToLocalPlan } from "@/lib/utils/server-to-local-plan";
import type { CourseType, PlanResponseType } from "@/types";

import { CourseList } from "./course-list";
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
      if (!returned.some((r) => r.value === onlineRegistration.id)) {
        returned.push({
          value: onlineRegistration.id,
          label: registrationReplacer(onlineRegistration.name),
        });
      }
    }

    return returned;
  };

  /* eslint-disable react-you-might-not-need-an-effect/no-event-handler */
  useEffect(() => {
    if (
      onlinePlan !== undefined &&
      onlinePlan !== null &&
      inputRef.current !== null
    ) {
      inputRef.current.value = onlinePlan.name;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlinePlan]);
  /* eslint-enable react-you-might-not-need-an-effect/no-event-handler */

  const collisions = detectCollisions(
    plan.allGroups.filter((g) => g.isChecked),
  );
  const collidingIds = collidingGroupIds(collisions);

  const isSynced = isEqual(
    plan.updatedAt,
    new Date(onlinePlan == null ? plan.updatedAt : onlinePlan.updatedAt),
  );

  return (
    <>
      <TopbarPortal>
        <form
          className="flex max-w-md min-w-0 flex-1 items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            plan.changeName(formData.get("name")?.toString() ?? "");
            inputRef.current?.blur();
          }}
        >
          <Input
            ref={inputRef}
            type="text"
            name="name"
            id="name"
            placeholder="Wolne poniedziałki"
            defaultValue={typeof window === "undefined" ? "" : plan.name}
            onChange={(event) => {
              plan.changeName(event.currentTarget.value);
            }}
            className="border-border bg-card/60 min-w-0 flex-1 rounded-lg text-sm font-medium"
          />
          <span
            className={cn(
              "hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap sm:inline-flex",
              isSynced
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/20 bg-amber-500/10 text-amber-400",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isSynced ? "bg-emerald-400" : "bg-amber-400",
              )}
            />
            {isSynced
              ? `Zapisano ${format(plan.updatedAt, "HH:mm")}`
              : "Niezapisane zmiany"}
          </span>
          <SyncedButton
            plan={plan}
            isSyncing={syncing}
            isEqualsDates={isSynced}
          />
        </form>
      </TopbarPortal>
      <Sidebar className="pt-16">
        <SidebarHeader />
        <SidebarContent>
          <div className="flex max-h-screen w-full flex-none flex-col gap-3 px-3 md:ml-4 md:w-[360px]">
            {offlineAlert ? <OfflineAlert /> : null}
            {isLoggedIn && onlinePlan !== null ? (
              <SyncErrorAlert
                onlinePlan={onlinePlan}
                planDate={plan.updatedAt}
                downloadChanges={handleUpdateLocalPlan}
                sendChanges={handleSyncPlan}
              />
            ) : null}

            <div className="flex gap-2">
              <PlanDisplayLink />
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  generateICSFile(plan.allGroups, plan.name);
                }}
              >
                <Icons.Download className="size-4" />
                Eksport .ics
              </Button>
            </div>

            <div>
              <Label htmlFor="faculty" className="mb-1">
                Wydział
              </Label>
              <Select<string>
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
                <SelectContent className="max-w-full">
                  {FACULTIES.map((f) => (
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

            <div>
              <p className="text-sm font-medium">Rejestracje</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {plan.registrations.map((registration) => (
                  <span
                    key={registration.id}
                    className="bg-secondary flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 text-xs"
                  >
                    {registrationReplacer(registration.name)}
                    <button
                      type="button"
                      onClick={() => {
                        plan.removeRegistration(registration.id);
                      }}
                      className="hover:bg-background/60 rounded-full p-0.5"
                    >
                      <Icons.X className="size-3" />
                    </button>
                  </span>
                ))}
                {registrations.isLoading ? (
                  <Skeleton className="h-7 w-24 rounded-full" />
                ) : (registrations.data?.length ?? 0) > 0 ? (
                  <RegistrationCombobox
                    name="registration"
                    registrations={mergeRegistrationsWithOnline()}
                    selectedRegistrations={plan.registrations.map((r) => r.id)}
                    onSelect={(registrationId) => {
                      if (registrations.data === undefined) {
                        return;
                      }
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
                ) : registrations.data?.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Brak rejestracji
                  </p>
                ) : null}
              </div>
            </div>

            <CourseList
              registrations={plan.registrations}
              courses={plan.courses}
              collidingGroupIds={collidingIds}
              onToggleGroup={(groupId) => {
                plan.selectGroup(groupId);
              }}
              onToggleCourse={(courseId, isChecked) => {
                plan.selectCourse(courseId, isChecked);
              }}
              onRemoveRegistration={(registrationId) => {
                plan.removeRegistration(registrationId);
              }}
            />
          </div>
        </SidebarContent>
        <Alerts className="animate-in fade-in slide-in-from-left mt-4 py-3" />
      </Sidebar>
    </>
  );
}

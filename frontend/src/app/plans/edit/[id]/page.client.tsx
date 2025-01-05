"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { format, isEqual } from "date-fns";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { toast } from "sonner";

import { getPlan } from "@/actions/plans";
import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import { ClassSchedule } from "@/components/class-schedule";
import { GroupsAccordionItem } from "@/components/groups-accordion";
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
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env.mjs";
import { useSession } from "@/hooks/use-session";
import { usePlan } from "@/lib/use-plan";
import { registrationReplacer } from "@/lib/utils";
import { createOnlinePlan } from "@/lib/utils/create-online-plan";
import { syncPlan } from "@/lib/utils/sync-plan";
import { updateLocalPlan } from "@/lib/utils/update-local-plan";
import type { LessonType } from "@/services/usos/types";
import { Day } from "@/services/usos/types";
import type { CourseType, FacultyType } from "@/types";

import { OfflineAlert } from "./_components/offline-alert";
import { SyncErrorAlert } from "./_components/sync-error-alert";
import { SyncedButton } from "./_components/synced-button";

export function CreateNewPlanPage({
  planId,
  faculties,
}: {
  planId: string;
  faculties: { name: string; value: string }[];
}) {
  const [syncing, setSyncing] = useState(false);
  const [offlineAlert, setOfflineAlert] = useState(false);
  const [faculty, setFaculty] = useState<string | null>(null);
  const { user } = useSession();

  const firstTime = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const plan = usePlan({ planId });

  const registrations = useQuery({
    enabled: faculty !== null,
    queryKey: ["registrations", faculty],
    queryFn: async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/departments/${faculty ?? ""}/registrations`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<FacultyType>;
    },
  });

  const {
    data: onlinePlan,
    refetch: refetchOnlinePlan,
    isLoading,
  } = useQuery({
    enabled: plan.onlineId !== null,
    queryKey: ["onlinePlan", plan.onlineId],
    queryFn: async () => {
      const response = await getPlan({ id: Number(plan.onlineId) });
      if (
        response === false ||
        (response as unknown as { status: number }).status === 404
      ) {
        plan.remove();
        toast.error("Nie udało się pobrać planu");
        router.push("/plans");
        return null;
      }
      return response;
    },
  });

  const coursesFunction = useMutation({
    mutationKey: ["courses"],
    mutationFn: async (registrationId: string) => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/departments/${faculty?.toString() ?? ""}/registrations/${encodeURIComponent(registrationId)}/courses`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<CourseType>;
    },
  });

  const handleCreateOnlinePlan = async () => {
    firstTime.current = false;
    const response = await createOnlinePlan(plan);

    if (response.status === "SUCCESS") {
      const { updatedAt, onlineId } = response;
      plan.setPlan((previous) => ({
        ...previous,
        synced: true,
        updatedAt: new Date(updatedAt),
        onlineId,
      }));

      toast.success("Utworzono plan");
    } else if (response.status === "NOT_LOGGED_IN") {
      setOfflineAlert(true);
    } else {
      toast.error("Nie udało się utworzyć planu w wersji online", {
        description: response.message,
        duration: 10_000,
      });
    }
  };

  const handleSyncPlan = async () => {
    setSyncing(true);
    const response = await syncPlan(plan);

    if (response.status === "SUCCESS") {
      await refetchOnlinePlan();

      plan.setPlan((previous) => ({
        ...previous,
        synced: true,
        updatedAt: response.updatedAt
          ? new Date(response.updatedAt)
          : new Date(),
      }));
    } else {
      toast.error(response.message, {
        duration: 10_000,
      });
    }
  };

  const handleUpdateLocalPlan = async () => {
    firstTime.current = false;
    const response = await updateLocalPlan(onlinePlan, coursesFunction);

    if (response.status === "SUCCESS") {
      const { updatedRegistrations, updatedCourses, updatedAt } = response;
      plan.setPlan({
        ...plan,
        registrations: updatedRegistrations,
        courses: updatedCourses,
        synced: true,
        toCreate: false,
        updatedAt,
      });
    } else {
      toast.error(response.message, {
        duration: 10_000,
      });
    }
  };

  const resetInactivityTimer = () => {
    if (user == null) {
      return;
    }
    if (inactivityTimeout.current !== null) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(() => {
      if (
        !plan.synced &&
        plan.onlineId !== null &&
        !offlineAlert &&
        !plan.toCreate
      ) {
        void handleSyncPlan();
      }
    }, 4000);
  };

  useEffect(() => {
    if (plan.onlineId === null && firstTime.current) {
      void handleCreateOnlinePlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.onlineId]);

  useEffect(() => {
    if (
      onlinePlan != null &&
      plan.onlineId !== null &&
      plan.toCreate &&
      firstTime.current
    ) {
      void handleUpdateLocalPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, onlinePlan]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimeout.current !== null) {
        clearTimeout(inactivityTimeout.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.name, plan.courses, plan.registrations, plan.allGroups, user]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Loader2Icon size={64} className="mb-4 animate-spin text-primary" />
        <h1 className="text-lg font-medium">Ładowanie twojego planu...</h1>
        <p className="text-xs text-muted-foreground">To potrwa tylko chwilkę</p>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-5 py-3 md:flex-row md:items-start">
      <div className="flex max-h-screen w-full flex-none flex-col items-center justify-center gap-2 px-2 md:ml-4 md:w-[350px] md:flex-col">
        {offlineAlert ? <OfflineAlert /> : null}
        <SyncErrorAlert
          downloadChanges={() => {
            void handleUpdateLocalPlan();
          }}
          sendChanges={() => {
            void handleSyncPlan();
          }}
          planDate={plan.updatedAt}
          onlinePlan={onlinePlan}
        />

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
                  <MdArrowBack size={20} />
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
            <PlanDisplayLink id={plan.id} />
          </div>

          <p className="text-xs text-muted-foreground">
            Ostatnia aktualizacja online:{" "}
            {format(plan.updatedAt, "dd.MM.yyyy HH:mm")}
          </p>
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
                                spotsOccupied: g.spotsOccupied,
                                spotsTotal: g.spotsTotal,
                                averageRating: g.averageRating,
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
      <div className="ml-2 flex w-full grow items-start overflow-x-scroll md:ml-0 md:w-auto">
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
                (g) => (g.day.toLocaleLowerCase() as Day) === day,
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

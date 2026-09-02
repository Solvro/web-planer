"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { FACULTIES } from "@/actions/v2/get-faculties";
import { getFacultyRegistrationsAction } from "@/actions/v2/get-faculty-registrations";
import { selectedFacultyAtom } from "@/atoms/faculty";
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
import { exportPlanToIcs } from "@/lib/plan/export-ics";
import {
  RegistrationUnavailableError,
  useRegistrationCoursesFetcher,
  withSelection,
} from "@/lib/plan/registration-courses";
import type { PlanHandle } from "@/lib/plan/use-plan";
import type { usePlanSync } from "@/lib/plan/use-plan-sync";
import { cn, registrationReplacer } from "@/lib/utils";
import type { Collision } from "@/lib/utils/detect-collisions";
import { collidingGroupIds } from "@/lib/utils/detect-collisions";
import type { Registration } from "@/types";

import { CourseList } from "./course-list";
import { OfflineAlert } from "./offline-alert";
import { SyncErrorAlert } from "./sync-error-alert";
import { SyncedButton } from "./synced-button";

export function AppSidebar({
  plan,
  sync,
  collisions,
}: {
  plan: PlanHandle;
  sync: ReturnType<typeof usePlanSync>;
  collisions: Collision[];
}) {
  const [faculty, setFaculty] = useAtom(selectedFacultyAtom);
  const [pendingRegistrationId, setPendingRegistrationId] = useState<
    string | null
  >(null);
  const fetchCourses = useRegistrationCoursesFetcher();

  const registrations = useQuery({
    enabled: faculty !== null,
    queryKey: ["registrations", faculty],
    queryFn: async (): Promise<Registration[]> => {
      const data = await getFacultyRegistrationsAction(faculty ?? "");
      return data.map((registration) => ({
        id: registration.id,
        name: registration.description,
        departmentId: faculty ?? "",
      }));
    },
  });

  const registrationOptions = useMemo(() => {
    const options = new Map<string, string>();
    for (const registration of registrations.data ?? []) {
      options.set(registration.id, registrationReplacer(registration.name));
    }
    for (const registration of plan.registrations) {
      if (!options.has(registration.id)) {
        options.set(registration.id, registrationReplacer(registration.name));
      }
    }
    return [...options].map(([value, label]) => ({ value, label }));
  }, [registrations.data, plan.registrations]);

  const collidingIds = useMemo(
    () => collidingGroupIds(collisions),
    [collisions],
  );

  const isSaved = sync.status === "synced" || sync.status === "local-only";
  const savedLabel =
    sync.status === "synced"
      ? `Zapisano ${format(new Date(plan.updatedAt), "HH:mm")}`
      : sync.status === "local-only"
        ? "Zapisano lokalnie"
        : "Niezapisane zmiany";

  const toggleRegistration = async (registrationId: string) => {
    if (plan.registrations.some((r) => r.id === registrationId)) {
      plan.removeRegistration(registrationId);
      return;
    }
    const registration = registrations.data?.find(
      (r) => r.id === registrationId,
    );
    if (registration === undefined) {
      return;
    }

    setPendingRegistrationId(registrationId);
    try {
      const courses = await fetchCourses(registrationId);
      plan.addRegistration(
        registration,
        withSelection(courses, {
          isCourseChecked: () => true,
          isGroupChecked: () => false,
        }),
      );
    } catch (error) {
      toast.error(
        error instanceof RegistrationUnavailableError
          ? error.message
          : "Nie udało się pobrać kursów dla tej rejestracji. Spróbuj ponownie.",
        { duration: 6000 },
      );
    } finally {
      setPendingRegistrationId(null);
    }
  };

  return (
    <>
      <TopbarPortal>
        <form
          className="flex max-w-md min-w-0 flex-1 items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            (
              event.currentTarget.elements.namedItem(
                "name",
              ) as HTMLInputElement | null
            )?.blur();
          }}
        >
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Wolne poniedziałki"
            value={plan.name}
            onChange={(event) => {
              plan.changeName(event.currentTarget.value);
            }}
            className="border-border bg-card/60 min-w-0 flex-1 rounded-lg text-sm font-medium"
          />
          <span
            className={cn(
              "hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap sm:inline-flex",
              isSaved
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/20 bg-amber-500/10 text-amber-400",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isSaved ? "bg-emerald-400" : "bg-amber-400",
              )}
            />
            {savedLabel}
          </span>
          <SyncedButton status={sync.status} />
        </form>
      </TopbarPortal>
      <Sidebar className="pt-16">
        <SidebarHeader />
        <SidebarContent>
          <div className="flex max-h-screen w-full flex-none flex-col gap-3 px-3 md:ml-4 md:w-[360px]">
            {sync.offlineAlert ? <OfflineAlert /> : null}
            {sync.hasConflict && sync.onlinePlan != null ? (
              <SyncErrorAlert
                localUpdatedAt={plan.updatedAt}
                onlineUpdatedAt={sync.onlinePlan.updatedAt}
                isPulling={sync.isPulling}
                isPushing={sync.isPushing}
                onPull={sync.pull}
                onPush={sync.push}
              />
            ) : null}

            <div className="flex gap-2">
              <PlanDisplayLink />
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  exportPlanToIcs(plan.allGroups, plan.name);
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
                value={faculty}
                onValueChange={setFaculty}
              >
                <SelectTrigger
                  className="pl-2"
                  disabled={registrations.isLoading}
                >
                  <SelectValue placeholder="Wybierz swój wydział">
                    {(value: string | null) =>
                      value === null
                        ? "Wybierz swój wydział"
                        : registrationReplacer(
                            FACULTIES.find((f) => f.value === value)?.name ??
                              value,
                          )
                    }
                  </SelectValue>
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
                      aria-label="Usuń rejestrację"
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
                ) : registrations.data === undefined ? null : registrations.data
                    .length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Brak rejestracji
                  </p>
                ) : (
                  <RegistrationCombobox
                    name="registration"
                    registrations={registrationOptions}
                    isPending={pendingRegistrationId !== null}
                    onSelect={(registrationId) => {
                      void toggleRegistration(registrationId);
                    }}
                  />
                )}
              </div>
            </div>

            <CourseList
              registrations={plan.registrations}
              courses={plan.courses}
              collidingGroupIds={collidingIds}
              onToggleGroup={plan.selectGroup}
              onToggleCourse={plan.selectCourse}
              onRemoveRegistration={plan.removeRegistration}
            />
          </div>
        </SidebarContent>
        <Alerts className="animate-in fade-in slide-in-from-left mt-4 py-3" />
      </Sidebar>
    </>
  );
}

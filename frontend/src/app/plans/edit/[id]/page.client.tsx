"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { getPlan } from "@/actions/plans";
import { ClassSchedule } from "@/components/class-schedule";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePlanOrientation } from "@/hooks/use-plan-orientation";
import { useSavePlan } from "@/hooks/use-save-plan";
import { useSession } from "@/hooks/use-session";
import { useShare } from "@/hooks/use-share";
import { fetchClient } from "@/lib/fetch";
import { usePlan } from "@/lib/use-plan";
import { updateSpotsOccupied } from "@/lib/utils/update-spots-occupied";
import { Day } from "@/types";
import type { CourseType } from "@/types";

import { DownloadPlanButton } from "../../_components/download-button";
import { SharePlanButton } from "../../_components/share-plan-button";
import { AppSidebar } from "./_components/app-sidebar";
import { HideDaysSettings } from "./_components/hide-days-settings";
import { SaveOfflineFunction } from "./_components/save-offline";
import { SaveOnlineFunction } from "./_components/save-online";

export function CreateNewPlanPage({ planId }: { planId: string }) {
  const { user } = useSession();
  const isLoggedIn = user !== null;
  const [offlineAlert, setOfflineAlert] = useState(false);
  const [faculty, setFaculty] = useState<string | null>(null);
  const { isDialogOpen, setIsDialogOpen } = useShare();
  const [hideDays, setHideDays] = useState(false);
  const { isHorizontal } = usePlanOrientation();

  const spotsSynced = useRef(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const plan = usePlan({ planId });

  const {
    data: onlinePlan,
    refetch: refetchOnlinePlan,
    isLoading,
  } = useQuery({
    enabled: plan.onlineId !== null && plan.onlineId !== "",
    queryKey: ["onlinePlan", plan.onlineId],
    queryFn: async () => {
      const response = await getPlan({ id: Number(plan.onlineId) });
      if (
        response === null ||
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
      const response = await fetchClient({
        url: `/departments/${encodeURIComponent(faculty ?? "")}/registrations/${encodeURIComponent(registrationId)}/courses`,
        method: "GET",
      });

      if (!response.ok) {
        toast.error(
          "Coś poszło nie tak podczas pobierania kursów, spróbuj ponownie",
        );
        throw new Error("Network response was not ok");
      }

      return response.json() as Promise<CourseType>;
    },
  });
  const {
    syncing,
    handleSyncPlan,
    handleUpdateLocalPlan,
    handleCreateOnlinePlan,
  } = useSavePlan({
    plan,
    onlinePlan,
    coursesFunction,
    refetchOnlinePlan,
  });

  const handleUpdateSpotsOccupied = async () => {
    spotsSynced.current = true;
    const response = await updateSpotsOccupied({
      plan,
      coursesFunction,
    });
    if (response.status === "SUCCESS") {
      const { updatedCourses, isChanged } = response;
      if (isChanged) {
        plan.setPlan((previous) => ({
          ...previous,
          courses: updatedCourses,
        }));
      }
    }
  };

  useEffect(() => {
    if (!spotsSynced.current) {
      void handleUpdateSpotsOccupied();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Icons.Loader size={64} className="mb-4 animate-spin text-primary" />
        <h1 className="text-lg font-medium">Ładowanie twojego planu...</h1>
        <p className="text-xs text-muted-foreground">To potrwa tylko chwilkę</p>
      </div>
    );
  }
  return (
    <>
      <AppSidebar
        isLoggedIn={isLoggedIn}
        plan={plan}
        handleUpdateLocalPlan={handleUpdateLocalPlan}
        handleSyncPlan={handleSyncPlan}
        onlinePlan={onlinePlan}
        syncing={syncing}
        setFaculty={setFaculty}
        coursesFunction={coursesFunction}
        inputRef={inputRef}
        offlineAlert={offlineAlert}
        faculty={faculty}
      />
      <SidebarInset className="mr-1 w-full overflow-x-auto overflow-y-auto bg-transparent pt-[72px]">
        <div className="ml-2 flex h-full w-full flex-1 flex-grow flex-col items-start md:ml-0 md:w-auto">
          <div className="flex h-0 flex-auto flex-col gap-3">
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
                isHorizontal={isHorizontal}
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
                    isHorizontal={isHorizontal}
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
      </SidebarInset>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="h-full max-h-[90%] w-full md:max-w-[1620px]">
          <DialogHeader>
            <DialogTitle>Udostępnij swój plan</DialogTitle>
            <DialogDescription className="text-balance">
              Możesz udostępnij link do swojego planu, aby inni mogli go
              zobaczyć lub pobrać w formacie .png
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-full max-h-[800px] overflow-y-auto">
            <HideDaysSettings hideDays={hideDays} setHideDays={setHideDays} />
            <div
              ref={captureRef}
              className="relative flex flex-col gap-2 bg-background p-1"
            >
              {[
                { day: Day.MONDAY, label: "Poniedziałek" },
                { day: Day.TUESDAY, label: "Wtorek" },
                { day: Day.WEDNESDAY, label: "Środa" },
                { day: Day.THURSDAY, label: "Czwartek" },
                { day: Day.FRIDAY, label: "Piątek" },
              ].map(
                ({ day, label }) =>
                  (!hideDays ||
                    plan.allGroups
                      .filter((g) => g.isChecked)
                      .some((g) => g.day === day)) && (
                    <ClassSchedule
                      key={day}
                      day={label}
                      isHorizontal={isHorizontal}
                      isReadonly={true}
                      selectedGroups={[]}
                      groups={plan.allGroups.filter(
                        (g) => g.day === day && g.isChecked,
                      )}
                      onSelectGroup={(groupdId) => {
                        plan.selectGroup(groupdId);
                      }}
                    />
                  ),
              )}
              {[
                { day: Day.SATURDAY, label: "Sobota" },
                { day: Day.SUNDAY, label: "Niedziela" },
              ].map(
                ({ day, label }) =>
                  plan.allGroups.some((g) => g.day === day) && (
                    <ClassSchedule
                      key={day}
                      day={label}
                      isHorizontal={isHorizontal}
                      isReadonly={true}
                      selectedGroups={[]}
                      groups={plan.allGroups.filter(
                        (g) => g.day === day && g.isChecked,
                      )}
                    />
                  ),
              )}

              <div className="absolute bottom-4 right-0 z-20 opacity-10">
                <div className="ml-4 flex items-center gap-4 text-2xl font-bold text-black dark:text-white md:w-1/4">
                  <Image
                    src={"/assets/logo/logo_solvro_mono.png"}
                    alt="Solvro logo"
                    className="hidden dark:block"
                    width={70}
                    height={70}
                  />
                  <Image
                    src={"/assets/logo/logo_solvro_color.png"}
                    alt="Solvro logo"
                    className="block dark:hidden"
                    width={70}
                    height={70}
                  />
                  <h1 className="hidden text-3xl font-semibold md:block">
                    Planer
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 100, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="absolute bottom-6 right-8 z-20 flex flex-col items-center gap-2 rounded-xl border bg-background/50 px-3 py-2 shadow-md backdrop-blur-[12px] md:flex-row md:rounded-full"
            >
              <DownloadPlanButton
                plan={plan}
                captureRef={captureRef}
                hideDays={hideDays}
              />

              <SharePlanButton plan={plan} />
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {isLoggedIn ? (
        <SaveOnlineFunction
          plan={plan}
          setOfflineAlert={setOfflineAlert}
          handleCreateOnlinePlan={handleCreateOnlinePlan}
          user={user}
          offlineAlert={offlineAlert}
          handleSyncPlan={handleSyncPlan}
        />
      ) : null}
      <SaveOfflineFunction
        plan={plan}
        onlinePlan={onlinePlan}
        coursesFunction={coursesFunction}
      />
    </>
  );
}

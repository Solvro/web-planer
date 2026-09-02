"use client";

import { useAtomValue } from "jotai";
import Image from "next/image";
import { useRef } from "react";

import { hideDaysAtom } from "@/atoms/hide-days";
import { WeekGrid } from "@/components/schedule/week-grid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShare } from "@/hooks/use-share";
import type { PlanHandle } from "@/lib/plan/use-plan";

import { DownloadPlanButton } from "../../../_components/download-button";
import { SharePlanButton } from "../../../_components/share-plan-button";
import { HideDaysSettings } from "./hide-days-settings";

export function SharePlanDialog({ plan }: { plan: PlanHandle }) {
  const { isDialogOpen, setIsDialogOpen } = useShare();
  const hideDays = useAtomValue(hideDaysAtom);
  const captureRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="h-full max-h-[90%] w-full md:max-w-[1620px]">
        <DialogHeader>
          <DialogTitle>Udostępnij swój plan</DialogTitle>
          <DialogDescription className="text-balance">
            Możesz udostępnij link do swojego planu, aby inni mogli go zobaczyć
            lub pobrać w formacie .png
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-full max-h-[800px] overflow-y-auto">
          <HideDaysSettings />
          <div ref={captureRef} className="bg-background relative p-1">
            <WeekGrid
              allGroups={plan.selectedGroups}
              selectedGroups={[]}
              collisions={[]}
              isReadonly={true}
              onlyDaysWithGroups={hideDays}
            />

            <div className="absolute right-0 bottom-4 z-20 opacity-10">
              <div className="ml-4 flex items-center gap-4 text-2xl font-bold text-black md:w-1/4 dark:text-white">
                <Image
                  src="/assets/logo/logo_solvro_mono.png"
                  alt="Solvro logo"
                  className="hidden dark:block"
                  width={70}
                  height={70}
                />
                <Image
                  src="/assets/logo/logo_solvro_color.png"
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
        <div className="bg-background/50 absolute right-8 bottom-6 z-20 flex flex-col items-center gap-2 rounded-xl border px-3 py-2 shadow-md backdrop-blur-[12px] md:flex-row md:rounded-full">
          <DownloadPlanButton
            captureRef={captureRef}
            planName={plan.name}
            hideDays={hideDays}
          />
          <SharePlanButton plan={plan} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

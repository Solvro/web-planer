"use client";

import { useAtomValue } from "jotai";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  shareHideDaysAtom,
  shareHideLecturesAtom,
  shareOrientationAtom,
} from "@/atoms/share-options";
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
import { SharePlanOptions } from "./share-plan-options";

export function SharePlanDialog({ plan }: { plan: PlanHandle }) {
  const { isDialogOpen, setIsDialogOpen } = useShare();
  const hideDays = useAtomValue(shareHideDaysAtom);
  const hideLectures = useAtomValue(shareHideLecturesAtom);
  const orientation = useAtomValue(shareOrientationAtom);
  const captureRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState({ scale: 1, height: 0 });
  const [referencesReady, setReferencesReady] = useState(false);

  const setCaptureRef = useCallback((node: HTMLDivElement | null) => {
    captureRef.current = node;
    setReferencesReady(viewportRef.current !== null && node !== null);
  }, []);

  const setViewportRef = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    setReferencesReady(node !== null && captureRef.current !== null);
  }, []);

  const groups = useMemo(
    () =>
      hideLectures
        ? plan.selectedGroups.filter((group) => group.courseType !== "W")
        : plan.selectedGroups,
    [plan.selectedGroups, hideLectures],
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const content = captureRef.current;
    if (viewport === null || content === null) {
      return;
    }
    const contentWidth = content.scrollWidth;
    const scale =
      contentWidth > 0 ? Math.min(1, viewport.clientWidth / contentWidth) : 1;
    setPreview({ scale, height: content.scrollHeight * scale });
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }
    const viewport = viewportRef.current;
    const content = captureRef.current;
    if (viewport === null || content === null) {
      return;
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(content);
    return () => {
      observer.disconnect();
    };
  }, [isDialogOpen, measure, groups, hideDays, orientation, referencesReady]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="flex h-[92vh] w-full max-w-[min(1400px,95vw)] flex-col gap-4 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Udostępnij swój plan</DialogTitle>
          <DialogDescription className="text-balance">
            Wygeneruj link, aby inni mogli zobaczyć Twój plan, albo pobierz go
            jako obrazek .png
          </DialogDescription>
        </DialogHeader>

        <SharePlanOptions />

        <div
          ref={setViewportRef}
          className="bg-background min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-xl border"
        >
          {groups.length === 0 ? (
            <p className="text-muted-foreground p-16 text-center text-sm">
              Brak zajęć do pokazania. Zmień ustawienia powyżej.
            </p>
          ) : (
            <div style={{ height: preview.height }}>
              <div
                ref={setCaptureRef}
                className="bg-background relative w-max origin-top-left p-3"
                style={{ transform: `scale(${preview.scale.toString()})` }}
              >
                <WeekGrid
                  allGroups={groups}
                  selectedGroups={[]}
                  collisions={[]}
                  isReadonly={true}
                  onlyDaysWithGroups={hideDays}
                  orientation={orientation}
                  fitContent={true}
                />

                <div className="pointer-events-none absolute right-4 bottom-4 z-20 opacity-10">
                  <div className="flex items-center gap-4 text-2xl font-bold text-black dark:text-white">
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
                    <h1 className="text-3xl font-semibold">Planer</h1>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <DownloadPlanButton
            captureRef={captureRef}
            planName={plan.name}
            hideDays={hideDays}
            hideLectures={hideLectures}
            disabled={groups.length === 0}
          />
          <SharePlanButton plan={plan} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

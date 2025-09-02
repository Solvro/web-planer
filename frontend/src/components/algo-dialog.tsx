"use client";

import {
  FolderInput,
  Loader2,
  RefreshCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import { usePlan } from "@/lib/use-plan";
import type { TimeSlot, WeekPreferences } from "@/lib/utils/schedule-algorithm";
import { createScheduleBasedOnCoursesAndPreferences } from "@/lib/utils/schedule-algorithm";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface DayState {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface ScheduleResult {
  success: boolean;
  schedule?: ExtendedGroup[];
  score?: number;
  message?: string;
  userPreferences?: WeekPreferences;
  availableCourses?: unknown[];
}

const DAYS = [
  { key: "monday" as keyof WeekPreferences, label: "Poniedziałek" },
  { key: "tuesday" as keyof WeekPreferences, label: "Wtorek" },
  { key: "wednesday" as keyof WeekPreferences, label: "Środa" },
  { key: "thursday" as keyof WeekPreferences, label: "Czwartek" },
  { key: "friday" as keyof WeekPreferences, label: "Piątek" },
  { key: "saturday" as keyof WeekPreferences, label: "Sobota" },
  { key: "sunday" as keyof WeekPreferences, label: "Niedziela" },
];

const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function AlgorithmDialog({
  availableCourses,
  planId,
}: {
  availableCourses: ExtendedCourse[];
  planId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [baseOnRating, setBaseOnRating] = useState(false);
  const [preferences, setPreferences] = useState<
    Record<keyof WeekPreferences, DayState>
  >({
    monday: { enabled: false, timeSlots: [{ start: "07:00", end: "20:00" }] },
    tuesday: { enabled: false, timeSlots: [{ start: "07:00", end: "20:00" }] },
    wednesday: {
      enabled: false,
      timeSlots: [{ start: "07:00", end: "20:00" }],
    },
    thursday: { enabled: false, timeSlots: [{ start: "07:00", end: "20:00" }] },
    friday: { enabled: false, timeSlots: [{ start: "07:00", end: "20:00" }] },
    saturday: { enabled: false, timeSlots: [{ start: "07:00", end: "20:00" }] },
    sunday: { enabled: false, timeSlots: [{ start: "07:00", end: "20:00" }] },
  });
  const [scheduleResult, setScheduleResult] = useState<ScheduleResult | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const plan = usePlan({ planId });

  const toggleDay = (day: keyof WeekPreferences) => {
    setPreferences((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        enabled: !previous[day].enabled,
      },
    }));
  };

  const updateTimeSlot = (
    day: keyof WeekPreferences,
    slotIndex: number,
    field: "start" | "end",
    value: string,
  ) => {
    setPreferences((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        timeSlots: previous[day].timeSlots.map((slot, index) =>
          index === slotIndex ? { ...slot, [field]: value } : slot,
        ),
      },
    }));
  };

  const addTimeSlot = (day: keyof WeekPreferences) => {
    setPreferences((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        timeSlots: [
          ...previous[day].timeSlots,
          { start: "07:00", end: "20:00" },
        ],
      },
    }));
  };

  const removeTimeSlot = (day: keyof WeekPreferences, slotIndex: number) => {
    setPreferences((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        timeSlots: previous[day].timeSlots.filter(
          (_, index) => index !== slotIndex,
        ),
      },
    }));
  };

  const generateSchedule = async () => {
    setIsGenerating(true);
    await wait(500);

    const weekPreferences: WeekPreferences = {} as WeekPreferences;

    for (const { key } of DAYS) {
      if (preferences[key].enabled) {
        weekPreferences[key] = preferences[key].timeSlots;
      }
    }

    const result = createScheduleBasedOnCoursesAndPreferences(
      weekPreferences,
      availableCourses,
      baseOnRating,
    );
    setScheduleResult(result);
    setIsGenerating(false);
  };

  const handleAddToUserPlan = () => {
    if (scheduleResult?.schedule !== undefined) {
      const updatedPlan = {
        ...plan,
        courses: plan.courses.map((course) => ({
          ...course,
          groups: course.groups.map((group) => ({
            ...group,
            isChecked: false,
          })),
        })),
        synced: false,
      };

      const finalPlan = {
        ...updatedPlan,
        courses: updatedPlan.courses.map((course) => ({
          ...course,
          groups: course.groups.map((group) => {
            const isInSchedule =
              scheduleResult.schedule?.some(
                (scheduleGroup) =>
                  scheduleGroup.groupOnlineId === group.groupOnlineId,
              ) ?? false;
            return isInSchedule ? { ...group, isChecked: true } : group;
          }),
        })),
      };

      plan.setPlan(finalPlan);

      setDialogOpen(false);
      toast.success("Plan został ustawiony poprawnie.");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Button className="w-full" variant={"default"}>
          Automatyczny plan <Sparkles />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto focus:outline-none">
        <DialogHeader>
          <DialogTitle>Ułóż plan automatycznie</DialogTitle>
          <DialogDescription>
            Wybierz dni tygodnia i przedziały czasowe, w których chcesz mieć
            zajęcia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {scheduleResult === null ? (
            <>
              {DAYS.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex justify-between space-y-3 rounded-lg bg-muted/30 p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={preferences[key].enabled}
                      onCheckedChange={() => {
                        toggleDay(key);
                      }}
                      id={`switch-${key}`}
                    />
                    <Label
                      htmlFor={`switch-${key}`}
                      className={`text-sm font-medium ${preferences[key].enabled ? "" : "text-gray-400"}`}
                    >
                      {label}
                    </Label>
                  </div>

                  {preferences[key].enabled ? (
                    <div className="space-y-2">
                      {preferences[key].timeSlots.map((slot, slotIndex) => (
                        <div
                          key={`${key}-${String(slotIndex)}`}
                          className="flex items-center space-x-2"
                        >
                          <span className="w-8 text-xs">Od:</span>
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(event) => {
                              updateTimeSlot(
                                key,
                                slotIndex,
                                "start",
                                event.target.value,
                              );
                            }}
                            className="w-24"
                          />
                          <span className="w-8 text-xs">Do:</span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(event) => {
                              updateTimeSlot(
                                key,
                                slotIndex,
                                "end",
                                event.target.value,
                              );
                            }}
                            className="w-24"
                          />
                          {preferences[key].timeSlots.length > 1 && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                removeTimeSlot(key, slotIndex);
                              }}
                              className="min-w-9 px-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          addTimeSlot(key);
                        }}
                        className="w-full text-xs"
                      >
                        + Dodaj przedział
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </>
          ) : null}

          <div className="flex flex-col space-y-4 pt-4">
            {scheduleResult === null ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={baseOnRating}
                    onCheckedChange={setBaseOnRating}
                  />
                  <p>Dopasuj na podstawie ocen</p>
                </div>
                <Button
                  onClick={generateSchedule}
                  disabled={
                    isGenerating ||
                    !DAYS.some(({ key }) => preferences[key].enabled)
                  }
                  className=""
                >
                  {isGenerating ? "Generowanie..." : "Wygeneruj plan"}
                  {isGenerating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles />
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant={"outline"}
                onClick={() => {
                  setScheduleResult(null);
                }}
              >
                <RefreshCcw /> Spróbuj ponownie
              </Button>
            )}

            {scheduleResult !== null && (
              <>
                <p className="text-xs text-muted-foreground">
                  Wybrane dni:{" "}
                  {DAYS.filter(({ key }) => preferences[key].enabled)
                    .map(({ label }) => label)
                    .join(", ")}
                </p>
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-medium">Wyniki:</h3>
                    <Badge
                      variant={
                        scheduleResult.success ? "default" : "destructive"
                      }
                    >
                      Dopasowanie: {scheduleResult.score}%
                    </Badge>
                  </div>
                  {scheduleResult.success ? (
                    <div>
                      <div className="space-y-1 text-xs">
                        {scheduleResult.schedule?.map((group, index) => (
                          <div
                            key={`${group.groupId}-${String(index)}`}
                            className="rounded p-2"
                          >
                            <span className="font-medium">
                              {group.courseName} ({group.courseType})
                            </span>{" "}
                            - {group.day} {group.startTime}-{group.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">
                      {scheduleResult.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {scheduleResult === null ? null : (
              <Button onClick={handleAddToUserPlan}>
                <FolderInput />
                Wstaw do swojego planu
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

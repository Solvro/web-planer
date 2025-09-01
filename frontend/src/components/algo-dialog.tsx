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
  const [includeLectures, setIncludeLectures] = useState(true);
  const [forceFillMissingCourses, setForceFillMissingCourses] = useState(false);
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
      includeLectures,
    );
    setScheduleResult(result);
    setIsGenerating(false);
  };

  const handleAddToUserPlan = () => {
    if (scheduleResult?.schedule == null) {
      return;
    }

    // Build set of selected groupIds from generated schedule
    const selectedGroupIds = new Set(
      scheduleResult.schedule.map((g) => g.groupId),
    );

    // Optionally force fill remaining courses (choose one group even if outside preferences)
    if (forceFillMissingCourses) {
      // Helper to convert HH:MM into minutes
      const toMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };
      // Map of all groups by id for quick lookup (use availableCourses as source)
      const groupById = new Map<string, ExtendedGroup>();
      for (const c of availableCourses) {
        for (const g of c.groups) {
          groupById.set(g.groupId, g);
        }
      }
      // Currently selected group objects (from schedule and any newly added)
      const selectedGroupObjects: ExtendedGroup[] = scheduleResult.schedule.map(
        (g) => g,
      );
      const hasConflict = (candidate: ExtendedGroup) => {
        return selectedGroupObjects.some((existing) => {
          if (existing.day !== candidate.day) {
            return false;
          }
          const s1 = toMinutes(existing.startTime);
          const end1 = toMinutes(existing.endTime);
          const s2 = toMinutes(candidate.startTime);
          const end2 = toMinutes(candidate.endTime);
          return !(end1 <= s2 || end2 <= s1);
        });
      };

      for (const course of availableCourses) {
        // Gather selected types for this course
        const selectedTypesForCourse = new Set(
          course.groups
            .filter((g) => selectedGroupIds.has(g.groupId))
            .map((g) => g.courseType),
        );
        // All types available for this course (respect includeLectures)
        const allTypesForCourse = [
          ...new Set(
            course.groups
              .filter((g) => (includeLectures ? true : g.courseType !== "W"))
              .map((g) => g.courseType),
          ),
        ];
        // For each missing type, try to pick a group.
        for (const type of allTypesForCourse) {
          if (selectedTypesForCourse.has(type)) {
            continue;
          }

          const candidates = course.groups
            .filter((g) => g.courseType === type)
            .filter((g) => (includeLectures ? true : g.courseType !== "W"));
          if (candidates.length === 0) {
            continue;
          }

          // Sort candidates: rating desc, then earlier start time
          const sorted = [...candidates].sort((a, b) => {
            const ratingA =
              typeof a.averageRating === "string"
                ? Number.parseFloat(a.averageRating)
                : a.averageRating;
            const ratingB =
              typeof b.averageRating === "string"
                ? Number.parseFloat(b.averageRating)
                : b.averageRating;
            if (ratingB !== ratingA) {
              return ratingB - ratingA;
            }
            return a.startTime.localeCompare(b.startTime);
          });

          let chosen: ExtendedGroup | null = null;
          for (const cand of sorted) {
            if (!hasConflict(cand)) {
              chosen = cand;
              break;
            }
          }
          // If all conflict, just take the highest rated (first) to ensure coverage.
          chosen ??= sorted[0];
          selectedGroupIds.add(chosen.groupId);
          selectedGroupObjects.push(chosen);
          selectedTypesForCourse.add(type);
        }
      }
    }

    // Uncheck all, then check selected ones
    const finalPlan = {
      ...plan,
      courses: plan.courses.map((course) => ({
        ...course,
        groups: course.groups.map((group) => ({
          ...group,
          isChecked: selectedGroupIds.has(group.groupId),
        })),
      })),
      synced: false,
    };

    plan.setPlan(finalPlan);
    setDialogOpen(false);
    toast.success(
      forceFillMissingCourses
        ? "Plan ustawiony (uzupełniono brakujące kursy)."
        : "Plan został ustawiony poprawnie.",
    );
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
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={baseOnRating}
                      onCheckedChange={setBaseOnRating}
                    />
                    <p>Dopasuj na podstawie ocen</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={includeLectures}
                      onCheckedChange={setIncludeLectures}
                    />
                    <p>Uwzględnij wykłady</p>
                  </div>
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
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs">
                  <Switch
                    checked={forceFillMissingCourses}
                    onCheckedChange={setForceFillMissingCourses}
                  />
                  <p>
                    Uzupełnij brakujące kursy (dodaj grupy spoza preferencji)
                  </p>
                </div>
                <Button onClick={handleAddToUserPlan}>
                  <FolderInput />
                  Wstaw do mojego planu
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

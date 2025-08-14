"use client";

import { Loader2, Sparkles, Trash2 } from "lucide-react";
import React, { useState } from "react";

import type { ExtendedCourse, ExtendedGroup } from "@/atoms/plan-family";
import { createScheduleBasedOnCoursesAndPreferences } from "@/lib/utils/schedule-algorithm";

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

interface TimeSlot {
  start: string;
  end: string;
}

interface WeekPreferences {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

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
}: {
  availableCourses: ExtendedCourse[];
}) {
  const [preferences, setPreferences] = useState<
    Record<keyof WeekPreferences, DayState>
  >({
    monday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
    wednesday: {
      enabled: false,
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
    thursday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
    sunday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
  });

  const [scheduleResult, setScheduleResult] = useState<ScheduleResult | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);

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
          { start: "09:00", end: "17:00" },
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

    // Konwertuj preferencje do formatu wymaganego przez algorytm
    const weekPreferences: WeekPreferences = {} as WeekPreferences;

    for (const { key } of DAYS) {
      if (preferences[key].enabled) {
        weekPreferences[key] = preferences[key].timeSlots;
      }
    }

    const result = createScheduleBasedOnCoursesAndPreferences(
      weekPreferences,
      availableCourses,
    );
    setScheduleResult(result);
    setIsGenerating(false);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full" variant={"default"}>
          Automatyczny plan <Sparkles />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ułóż plan automatycznie</DialogTitle>
          <DialogDescription>
            Wybierz dni tygodnia i przedziały czasowe, w których chcesz mieć
            zajęcia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="space-y-3 rounded-lg bg-muted/30 p-4">
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
                    className="text-xs"
                  >
                    + Dodaj przedział
                  </Button>
                </div>
              ) : null}
            </div>
          ))}

          <div className="flex flex-col space-y-4 pt-4">
            <Button
              onClick={generateSchedule}
              disabled={
                isGenerating ||
                !DAYS.some(({ key }) => preferences[key].enabled)
              }
              className="w-full"
            >
              {isGenerating ? "Generowanie..." : "Wygeneruj plan"}
              {isGenerating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles />
              )}
            </Button>

            {scheduleResult !== null && (
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-medium">Wyniki:</h3>
                {scheduleResult.success ? (
                  <div>
                    <p className="mb-2 text-sm text-green-600">
                      Plan został wygenerowany! Dopasowanie:{" "}
                      {scheduleResult.score}%
                    </p>
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useAtom } from "jotai";

import {
  scheduleSelectedDayAtom,
  scheduleViewModeAtom,
} from "@/atoms/schedule-view";

export function useScheduleView() {
  const [viewMode, setViewMode] = useAtom(scheduleViewModeAtom);
  const [selectedDay, setSelectedDay] = useAtom(scheduleSelectedDayAtom);

  return { viewMode, setViewMode, selectedDay, setSelectedDay };
}

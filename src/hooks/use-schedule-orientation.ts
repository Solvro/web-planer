"use client";

import { useAtom } from "jotai";

import { scheduleOrientationAtom } from "@/atoms/schedule-orientation";

export function useScheduleOrientation() {
  const [orientation, setOrientation] = useAtom(scheduleOrientationAtom);

  return { orientation, setOrientation };
}

"use client";

import { useAtom } from "jotai";

import { scheduleDensityAtom } from "@/atoms/schedule-density";

export function useScheduleDensity() {
  const [density, setDensity] = useAtom(scheduleDensityAtom);

  return { density, setDensity };
}

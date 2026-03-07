"use client";

import { useAtom } from "jotai";

import type { PlanOrientation } from "@/atoms/plan-orientation";
import { planOrientationAtom } from "@/atoms/plan-orientation";

export function usePlanOrientation() {
  const [orientation, setOrientation] = useAtom(planOrientationAtom);
  const isHorizontal = orientation === "horizontal";
  const toggle = () => {
    setOrientation((o: PlanOrientation) =>
      o === "horizontal" ? "vertical" : "horizontal",
    );
  };
  return { isHorizontal, toggle };
}

"use client";

import { createPortal } from "react-dom";

import { useHydrated } from "@/hooks/use-hydrated";

export const TOPBAR_SLOT_ID = "plan-header-slot";

/** Renders children into the topbar slot (defined in the plans layout). */
export function TopbarPortal({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  if (!hydrated) {
    return null;
  }
  const target = document.querySelector(`#${TOPBAR_SLOT_ID}`);
  return target === null ? null : createPortal(children, target);
}

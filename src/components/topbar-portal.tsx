"use client";

import { createPortal } from "react-dom";

export function TopbarPortal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") {
    return null;
  }

  const target = document.querySelector("#plan-header-slot");

  if (target === null) {
    return null;
  }

  return createPortal(children, target);
}

"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function SidebarTriggerButton() {
  const segments = useSelectedLayoutSegments();
  if (segments == null) {
    return null;
  }
  if (segments.includes("edit")) {
    return <SidebarTrigger className="mr-2 min-w-7 text-white md:mr-0" />;
  }
  return null;
}

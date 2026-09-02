"use client";

import { toast } from "sonner";

import { downloadIcs } from "@/lib/utils/generate-ics-file";
import type { ExtendedGroup } from "@/types";

/** Downloads the plan as .ics and explains when some groups could not be exported. */
export function exportPlanToIcs(groups: ExtendedGroup[], name: string): void {
  const { exportedGroups, skippedGroups } = downloadIcs(groups, name);

  if (exportedGroups === 0) {
    toast.error(
      skippedGroups > 0
        ? "Ten plan nie ma zapisanych terminów zajęć. Otwórz go w edytorze, aby je pobrać, i spróbuj ponownie."
        : "Najpierw wybierz grupy w planie.",
    );
    return;
  }

  if (skippedGroups > 0) {
    toast.warning(
      `Pominięto ${skippedGroups.toString()} grup bez terminów zajęć. Otwórz plan w edytorze, aby je odświeżyć.`,
    );
  }
}

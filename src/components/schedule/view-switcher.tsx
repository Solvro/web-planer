"use client";

import { useScheduleView } from "@/hooks/use-schedule-view";
import { cn } from "@/lib/utils";

const OPTIONS: { value: "week" | "day" | "list"; label: string }[] = [
  { value: "week", label: "Tydzień" },
  { value: "day", label: "Dzień" },
  { value: "list", label: "Lista" },
];

export function ViewSwitcher() {
  const { viewMode, setViewMode } = useScheduleView();

  return (
    <div className="bg-muted flex items-center gap-1 rounded-full p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => {
            setViewMode(option.value);
          }}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            viewMode === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

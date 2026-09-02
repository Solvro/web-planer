"use client";

import { useScheduleDensity } from "@/hooks/use-schedule-density";
import { cn } from "@/lib/utils";

const OPTIONS: {
  value: "compact" | "standard" | "relaxed";
  label: string;
}[] = [
  { value: "compact", label: "Kompakt" },
  { value: "standard", label: "Standard" },
  { value: "relaxed", label: "Luźno" },
];

export function DensitySwitcher() {
  const { density, setDensity } = useScheduleDensity();

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground hidden text-xs font-medium sm:block">
        Gęstość
      </span>
      <div className="bg-muted flex items-center gap-1 rounded-full p-1">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setDensity(option.value);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              density === option.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

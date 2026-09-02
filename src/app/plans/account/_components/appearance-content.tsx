"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const OPTIONS: { value: "light" | "dark" | "system"; label: string }[] = [
  { value: "light", label: "Jasny" },
  { value: "dark", label: "Ciemny" },
  { value: "system", label: "System" },
];

export function AppearanceContent() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Wygląd</h3>
        <p className="text-muted-foreground text-sm">
          Wybierz preferowany motyw strony.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setTheme(option.value);
            }}
            className={cn(
              "border-muted rounded-lg border-2 p-3 text-left transition-colors",
              theme === option.value &&
                "ring-ring ring-offset-background ring-2 ring-offset-2",
            )}
          >
            <div
              className={cn(
                "space-y-2 rounded-md p-3",
                option.value === "dark" ? "bg-zinc-950" : "bg-[#ecedef]",
              )}
            >
              <div
                className={cn(
                  "h-2 w-3/4 rounded-lg",
                  option.value === "dark" ? "bg-zinc-400" : "bg-white",
                )}
              />
              <div
                className={cn(
                  "h-2 w-1/2 rounded-lg",
                  option.value === "dark" ? "bg-zinc-400" : "bg-white",
                )}
              />
            </div>
            <span className="text-muted-foreground mt-3 block text-sm">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Icons } from "@/components/icons";
import { useScheduleOrientation } from "@/hooks/use-schedule-orientation";
import { cn } from "@/lib/utils";

export function OrientationSwitch() {
  const { orientation, setOrientation } = useScheduleOrientation();

  return (
    <div className="bg-muted flex items-center gap-1 rounded-full p-1">
      <button
        type="button"
        aria-label="Ułóż dni poziomo"
        onClick={() => {
          setOrientation("horizontal");
        }}
        className={cn(
          "rounded-full p-1.5 transition-colors",
          orientation === "horizontal"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icons.GalleryVertical className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Ułóż dni pionowo"
        onClick={() => {
          setOrientation("vertical");
        }}
        className={cn(
          "rounded-full p-1.5 transition-colors",
          orientation === "vertical"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icons.GalleryHorizontal className="size-4" />
      </button>
    </div>
  );
}

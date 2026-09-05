"use client";

import { useAtom } from "jotai";

import type { ScheduleOrientation } from "@/atoms/schedule-orientation";
import {
  shareHideDaysAtom,
  shareHideLecturesAtom,
  shareOrientationAtom,
} from "@/atoms/share-options";
import { Icons } from "@/components/icons";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const ORIENTATIONS: {
  value: ScheduleOrientation;
  label: string;
  icon: typeof Icons.GalleryVertical;
}[] = [
  { value: "vertical", label: "Pionowo", icon: Icons.GalleryHorizontal },
  { value: "horizontal", label: "Poziomo", icon: Icons.GalleryVertical },
];

function ToggleOption({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <span className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
      </span>
    </label>
  );
}

export function SharePlanOptions() {
  const [hideDays, setHideDays] = useAtom(shareHideDaysAtom);
  const [hideLectures, setHideLectures] = useAtom(shareHideLecturesAtom);
  const [orientation, setOrientation] = useAtom(shareOrientationAtom);

  return (
    <div className="bg-muted/40 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border p-3">
      <ToggleOption
        label="Ukryj dni bez zajęć"
        description="Pomija puste dni tygodnia"
        checked={hideDays}
        onCheckedChange={(checked) => {
          setHideDays(checked);
          void window.umami?.track("Set hide days", {
            checked: checked.toString(),
          });
        }}
      />
      <ToggleOption
        label="Ukryj wykłady"
        description="Zostawia tylko zajęcia w grupach"
        checked={hideLectures}
        onCheckedChange={(checked) => {
          setHideLectures(checked);
          void window.umami?.track("Set hide lectures", {
            checked: checked.toString(),
          });
        }}
      />
      <div className="ml-auto flex items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">Układ</span>
        <div className="bg-background flex items-center gap-1 rounded-full border p-1">
          {ORIENTATIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setOrientation(option.value);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                orientation === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <option.icon className="size-4" />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

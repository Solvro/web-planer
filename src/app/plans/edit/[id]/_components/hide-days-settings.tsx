"use client";

import { useAtom } from "jotai";

import { hideDaysAtom } from "@/atoms/hide-days";
import { Switch } from "@/components/ui/switch";

export function HideDaysSettings() {
  const [hideDays, setHideDays] = useAtom(hideDaysAtom);

  return (
    <div className="flex items-center gap-4 p-4">
      <h3>Ukryj dni bez zajęć</h3>
      <Switch
        checked={hideDays}
        onCheckedChange={(checked) => {
          setHideDays(checked);
          void window.umami?.track("Set hide days", {
            checked: checked.toString(),
          });
        }}
      />
    </div>
  );
}

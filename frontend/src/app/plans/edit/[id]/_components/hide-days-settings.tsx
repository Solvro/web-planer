import type { Dispatch, SetStateAction } from "react";
import React from "react";

import { Switch } from "@/components/ui/switch";

export function HideDaysSettings({
  hideDays,
  setHideDays,
}: {
  hideDays: boolean;
  setHideDays: Dispatch<SetStateAction<boolean>>;
}) {
  const handleChange = (checked: boolean) => {
    setHideDays(checked);
    localStorage.setItem("hideDays", JSON.stringify(checked));
    void window.umami?.track("Set hide days", {
      checked: checked.toString(),
    });
  };
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <h3>Ukryj dni bez zajęć</h3>
      <Switch checked={hideDays} onCheckedChange={handleChange} />
    </div>
  );
}

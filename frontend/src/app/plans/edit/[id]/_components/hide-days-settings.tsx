import type { Dispatch, SetStateAction } from "react";
import React, { useEffect, useRef } from "react";

import { Switch } from "@/components/ui/switch";

export function HideDaysSettings({
  hideDays,
  setHideDays,
}: {
  hideDays: boolean;
  setHideDays: Dispatch<SetStateAction<boolean>>;
}) {
  const firstTime = useRef(true);

  const handleChange = (checked: boolean) => {
    setHideDays(checked);
    localStorage.setItem("hideDays", JSON.stringify(checked));
    void window.umami?.track("Set hide days", {
      checked: checked.toString(),
    });
  };

  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;
      const hideDaysSett = localStorage.getItem("hideDays");
      if (hideDaysSett !== null) {
        setHideDays(JSON.parse(hideDaysSett) as boolean);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex items-center gap-4 p-4">
      <h3>Ukryj dni bez zajęć</h3>
      <Switch checked={hideDays} onCheckedChange={handleChange} />
    </div>
  );
}

import React from "react";

import { cn } from "@/lib/utils";

function Hour({ hour, isHorizontal }: { hour: string; isHorizontal: boolean }) {
  const [startHour, startMinute] = hour.split(":").map(Number);

  const startGrid = startHour * 12 - 7 * 12 - 5 + startMinute / 5;

  return (
    <div
      className={cn(
        "relative z-0 text-xs leading-6 text-gray-500 after:absolute after:-z-10 after:bg-slate-200 dark:after:bg-slate-800",
        isHorizontal
          ? "after:top-1/2 after:h-[1px] after:w-screen"
          : "-translate-x-1/2 transform text-center after:left-1/2 after:top-[-30px] after:h-screen after:w-[1px]",
      )}
      style={
        isHorizontal
          ? {
              gridRowStart: startGrid,
              gridRowEnd: `span 4`,
            }
          : {
              gridColumnStart: startGrid,
              gridColumnEnd: `span 4`,
            }
      }
    >
      <span className="bg-white py-0.5 dark:bg-background">{hour}</span>
    </div>
  );
}

export { Hour };

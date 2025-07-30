import React from "react";

function Hour({ hour }: { hour: string }) {
  const [startHour, startMinute] = hour.split(":").map(Number);

  const startGrid = startHour * 12 - 7 * 12 - 5 + startMinute / 5;

  return (
    <div
      className="relative z-0 text-xs leading-6 text-gray-500 after:absolute after:top-1/2 after:-z-10 after:h-[1px] after:w-screen after:bg-slate-200 dark:after:bg-slate-800"
      style={{
        gridRowStart: startGrid,
        gridRowEnd: `span 1`,
      }}
    >
      <span className="bg-white py-0.5 dark:bg-background">{hour}</span>
    </div>
  );
}

export { Hour };

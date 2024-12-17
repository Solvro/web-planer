import React from "react";

function Hour({ hour }: { hour: string }) {
  const [startHour, startMinute] = hour.split(":").map(Number);

  const startGrid = startHour * 12 - 7 * 12 - 5 + startMinute / 5;

  return (
    <div
      className="after:top- relative z-0 -translate-x-1/2 transform text-center text-xs leading-6 text-gray-500 after:absolute after:left-1/2 after:top-[-30px] after:-z-10 after:h-screen after:w-[1px] after:bg-slate-200"
      style={{
        gridColumnStart: startGrid,
        gridColumnEnd: `span 4`,
      }}
    >
      <span className="bg-white py-0.5">{hour}</span>
    </div>
  );
}

export { Hour };

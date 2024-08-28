import React from "react";

const Hour = ({ hour }: { hour: string }) => {
  const [startHour, startMinute] = hour.split(":").map(Number);

  const startGrid = startHour * 12 - 7 * 12 - 5 + startMinute / 5;

  return (
    <div
      className="relative z-0 -translate-x-1/2 transform text-center text-xs leading-6 text-gray-500"
      style={{
        gridColumnStart: startGrid,
        gridColumnEnd: `span 4`,
      }}
    >
      <span className="bg-white py-0.5">{hour}</span>
      <div
        className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-slate-200"
        style={{ top: "-30px" }}
      />
    </div>
  );
};

export { Hour };

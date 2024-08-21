import React from "react";

export const Plan = ({ name }: { name: string }) => {
  return (
    <button className="bg-white p-4 shadow-lg rounded-lg w-[200px] h-[200px] text-left">
      <div className="font-semibold text-xl">{name}</div>
      <div className="mt-2 text-gray-600">
        Kliknij w plan, aby wyświetlić szczegóły
      </div>
    </button>
  );
};


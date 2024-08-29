import Link from "next/link";
import React from "react";

export const Plan = ({ id, name }: { id: number; name: string }) => {
  return (
    <Link
      href={`createplan/${id}`}
      className="bg-white p-4 shadow-lg rounded-lg w-[200px] h-[200px] text-left"
    >
      <div className="font-semibold text-xl">{name}</div>
      <div className="mt-2 text-gray-600">Kliknij w plan, aby wyświetlić szczegóły</div>
    </Link>
  );
};

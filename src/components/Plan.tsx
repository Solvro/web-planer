import Link from "next/link";
import React from "react";

export const Plan = ({ id, name }: { id: number; name: string }) => {
  return (
    <Link
      href={`/createplan/${id}`}
      className="flex h-[200px] w-[200px] flex-col items-center justify-center rounded-lg border-2 border-gray-400 bg-white p-4 text-center shadow-lg"
    >
      <div className="text-xl font-semibold">{name}</div>
      <div className="mt-2 text-gray-600">
        Kliknij w plan, aby wyświetlić szczegóły
      </div>
    </Link>
  );
};

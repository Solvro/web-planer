import { useAtom } from "jotai";
import Link from "next/link";
import React from "react";

import { planFamily } from "@/pages/createplan/[id]";
import { plansIds } from "@/pages/plans";

export const Plan = ({ id, name }: { id: number; name: string }) => {
  const [plans, setPlans] = useAtom(plansIds);

  const deletePlan = () => {
    planFamily.remove({ id });
    setPlans(plans.filter((p) => p.id !== id));
  };
  // return (
  //   <Link
  //     href={`/createplan/${id}`}
  //     className="flex h-[200px] w-[200px] flex-col items-center justify-center rounded-lg border-2 border-gray-400 bg-white p-4 text-center shadow-lg"
  //   >
  //     <div className="text-xl font-semibold">{name}</div>
  //     <div className="mt-2 text-gray-600">
  //       Kliknij w plan, aby wyświetlić szczegóły
  //     </div>
  //   </Link>
  // );
  return (
    <div className="flex justify-between bg-slate-600 text-white">
      <Link href={`/app/createplan/${id}`}>{name}</Link>
      <button onClick={deletePlan} className="cursor-pointer">
        Delete
      </button>
    </div>
  );
};

import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdArrowBack } from "react-icons/io";

import { Plan } from "@/components/Plan";
import { Seo } from "@/components/SEO";
import { SolvroLogo } from "@/components/SolvroLogo";

import { planFamily } from "./createplan/[id]";

export const plansIds = atomWithStorage<Array<{ id: number }>>("plansIds", []);

const plansAtom = atom(
  (get) => get(plansIds).map((id) => get(planFamily(id))),
  (get, set, values: Array<{ id: number }>) => {
    set(plansIds, values);
  },
);

const Plans = () => {
  const [plans, setPlans] = useAtom(plansAtom);
  const router = useRouter();

  const addNewPlan = () => {
    const newPlan = {
      id: plans.length + 1,
    };

    void window.umami.track("Create plan", {
      numberOfPlans: plans.length,
    });

    void router.push(`/createplan/${newPlan.id}`).then(() => {
      setPlans([...plans, newPlan]);
    });
  };

  return (
    <>
      <Seo pageTitle="Twoje Plany | Planer" />
      <div className="flex h-screen flex-col items-stretch">
        <div className="flex h-20 items-center justify-between bg-mainbutton5">
          <div className="ml-4 w-1/4 flex-none">
            <SolvroLogo />
          </div>
          <div className="flex flex-grow justify-center">
            <div className="flex items-center justify-center text-lg font-semibold text-white md:text-3xl">
              <p className="text-nowrap">Twoje Plany</p>
            </div>
          </div>
          <div className="mr-4 flex w-1/4 justify-end">
            <Image
              src="https://github.com/shadcn.png"
              width={40}
              height={40}
              className="rounded-full"
              alt="Picture of the author"
            />
          </div>
        </div>

        <div className="container mx-auto max-h-full flex-1 flex-grow overflow-y-auto bg-gray-200 p-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <button
              onClick={addNewPlan}
              className="flex h-[200px] w-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 shadow-xl"
            >
              <span>Dodaj nowy plan</span>
            </button>
            {plans.map((plan) => (
              <Plan key={plan.id} id={plan.id} name={plan.name} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex h-14 flex-row items-center justify-between bg-mainbutton3 text-sm text-white">
            <Link
              href="/"
              className="flex h-full flex-1 cursor-pointer items-center justify-center gap-2 text-center font-semibold transition-all hover:bg-solvroshadow hover:shadow-lg"
            >
              <IoMdArrowBack size={20} className="block" />
              Powrót do głównej strony
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Plans;

import React, { useState } from "react";
import { Plan } from "@/components/plan";
import Link from "next/link";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import Image from "next/image";
const Plans = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: "Plan domyślny - poniedziałek" },
    { id: 2, name: "Plan domyślny - wolna środa" },
  ]);

  const addNewPlan = () => {
    const newPlan = {
      id: Date.now(),
      name: `Nowy plan - ${plans.length + 1}`,
    };
    setPlans([...plans, newPlan]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center h-14 bg-mainbutton5">
        <a href="https://planer.solvro.pl/" className="flex-shrink-0 ml-4">
          <Image
            src="/assets/logo/solvro_white.png"
            alt="Logo Koła Naukowego Solvro"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </a>
        <h1 className="text-xl sm:text-3xl text-center text-white mx-auto">
          Twoje plany
        </h1>
        <div className="hidden sm:block flex-none pr-4">
          <Image
            src="https://github.com/shadcn.png"
            width={40}
            height={40}
            className="rounded-full"
            alt="Picture of the author"
          />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container bg-gray-200 rounded p-4 mx-auto flex flex-col h-[calc(100vh-128px)]">
          <div className="flex flex-wrap gap-4 overflow-y-auto">
            <Link
              onClick={addNewPlan}
              href="createplan"
              className="border-dashed border-2 border-gray-400 rounded-lg flex justify-center items-center p-4 h-[200px] w-[200px] shadow-xl"
            >
              <span>Dodaj nowy plan</span>
            </Link>
            {plans.map((plan) => (
              <Plan key={plan.id} name={plan.name} />
            ))}
          </div>
        </div>
      </main>
      <div>
        <div className="flex flex-row items-center justify-between bg-mainbutton3 text-white h-32 sm:h-14 text-sm sm:text-lg">
          <Link
            href="/"
            className="h-32 sm:h-14 gap-4 flex-1 flex sm:flex-row min-w-32 items-center justify-center text-center hover:bg-solvroshadow cursor-pointer w-full sm:w-auto transition-all hover:shadow-lg font-semibold"
          >
            <IoMdArrowBack size={20} className="block" />
            Powrót do głównej strony
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Plans;

import React, { useState } from "react";
import { Plan } from "@/components/plan";
import Link from "next/link";

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
      <header className="bg-blue-500 text-white p-4 flex justify-between">
        <Link className="text-2xl font-bold" href="/">
          PLANNER
        </Link>
        <div>
          <button className="text-white px-4 py-2 rounded">Moje plany</button>
          <button className="text-white px-4 py-2 rounded">Zaloguj</button>
        </div>
      </header>
      <main className="flex-grow pt-3">
        <div className="pb-6">
          <h1 className="font-bold text-center text-4xl">
            Twoje plany Bartus Lewaku
          </h1>
        </div>
        <div className="bg-gray-200 p-4 mx-auto h-screen max-h-[1000px] w-full max-w-[2200px] overflow-y-auto">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={addNewPlan}
              className="border-dashed border-2 border-gray-400 rounded-lg flex justify-center items-center p-4 h-[200px] w-[200px]"
            >
              <span>Dodaj nowy plan</span>
            </button>
            {plans.map((plan) => (
              <Plan key={plan.id} name={plan.name} />
            ))}
          </div>
        </div>
      </main>
      <footer>
        <div className="bg-blue-200 p-6"></div>
        <div className="bg-blue-500 text-white p-4 text-center">
          &copy; 2069 Bartus Lewaku
        </div>
      </footer>
    </div>
  );
};

export default Plans;

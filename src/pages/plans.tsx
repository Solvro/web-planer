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
      <main className="flex-grow pt-3 flex flex-col">
        <div className="pb-6">
          <h1 className="font-bold text-center text-4xl">
            Twoje plany Bartus Lewaku
          </h1>
        </div>
        <div className="flex-grow bg-gray-200 p-4 container mx-auto overflow-y-auto max-h-[calc(100vh-400px)]">
          <div className="flex flex-wrap gap-4 justify-center items-center sm:justify-start">
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
        <div className="p-9"></div>
        <div className="bg-blue-200 p-6"></div>
        <div className="bg-blue-500 text-white p-4 text-center">
          &copy; 2069 Bartus Lewaku
        </div>
      </footer>
    </div>
  );
};

export default Plans;

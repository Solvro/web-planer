import React, { useState } from "react";
import Plan from "../components/ui/plan";

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
        <h1 className="text-2xl font-bold">PLANNER</h1>
        <span>
          <button className="text-white px-4 py-2 rounded">Moje plany</button>
          <button className="text-white px-4 py-2 rounded">Zaloguj</button>
        </span>
      </header>
      <main className="flex-grow pt-3">
        <div className="pb-6">
          <h1 className="font-bold text-center text-4xl">
            Twoje plany Bartus Lewaku
          </h1>
        </div>
        <div className="bg-gray-200 p-4 mx-auto grid gap-4 min-h-[400px] max-w-screen-lg grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          <button
            onClick={addNewPlan}
            className="border-dashed border-2 border-gray-400 flex justify-center items-center p-4 h-[200px]"
          >
            <h1>Dodaj nowy plan</h1>
          </button>
          {plans.map((plan) => (
            <Plan key={plan.id} name={plan.name} />
          ))}
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

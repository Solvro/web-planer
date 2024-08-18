import React from "react";

interface PlanProps {
  name: string;
}

const Plan: React.FC<PlanProps> = ({ name }) => {
  return (
    <button className="bg-white p-4 shadow-lg rounded-lg w-full h-[200px]">
      <h2 className="font-semibold">{name}</h2>
      <p className="mt-auto">Kliknij w plan, aby wyświetlić szczegóły</p>
    </button>
  );
};

export default Plan;

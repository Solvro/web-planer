import React from "react";

interface PlanProps {
  name: string;
}

const Plan: React.FC<PlanProps> = ({ name }) => {
  return (
    <div className="bg-white p-4 shadow-lg rounded w-full h-[200px]">
      <h2 className="font-semibold">{name}</h2>
      <p>Kliknij w plan, aby wyświetlić szczegóły</p>
    </div>
  );
};

export default Plan;

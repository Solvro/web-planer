import React from "react";

import { GroupsAccordion } from "@/components/Accordion";
import type { Registration } from "@/lib/types";
import type { ExtendedCourse } from "@/pages/createplan/[id]";

export const SelectGroups = ({
  registrations,
  courses,
  checkCourse,
}: {
  registrations: Registration[];
  courses: ExtendedCourse[];
  checkCourse: (id: string) => void;
}) => {
  return (
    <div className="overflow-auto">
      <h1 className="p-4 text-2xl font-semibold">Wybierz odpowiednią turę:</h1>
      {registrations.map((registration, index) => (
        <GroupsAccordion
          key={registration.name}
          index={index}
          registrationName={registration.name}
          onClick={checkCourse}
          courses={courses}
        />
      ))}
    </div>
  );
};

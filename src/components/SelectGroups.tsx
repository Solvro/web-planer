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
    <div className="w-full overflow-auto">
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

import React from "react";

import { GroupsAccordion } from "@/components/Accordion";
import type { Registration } from "@/lib/types";
import type { ExtendedCourse } from "@/pages/createplan/[id]";

const registrations = [{ name: "Rejestracja 1" }];

export const SelectGroups = ({
  handleDepartmentChange,
  handleRegistrationChange,
}: {
  courses: ExtendedCourse[];
  checkCourse: (id: string) => void;
  handleDepartmentChange: (value: string) => Promise<Registration[]>;
  handleRegistrationChange: (value: string) => Promise<void>;
}) => {
  return (
    <div className="w-full overflow-auto">
      {registrations.map((registration, index) => (
        <div key={registration.name} className="mb-4">
          <GroupsAccordion
            index={index}
            registrationName={registration.name}
            onDepartmentChange={handleDepartmentChange}
            onRegistrationChange={handleRegistrationChange}
          />
        </div>
      ))}
    </div>
  );
};

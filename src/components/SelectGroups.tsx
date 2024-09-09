import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";

import { GroupsAccordion } from "@/components/Accordion";
import type { ClassBlockProps, MockRegistration } from "@/lib/types";
import type { ExtendedCourse } from "@/pages/createplan/[id]";

const registrations = [
  { name: "Rejestracja 1" },
  { name: "Rejestracja 2" },
  { name: "Rejestracja 3" },
];

export const SelectGroups = ({
  handleDepartmentChange,
  handleRegistrationChange,
}: {
  courses: ExtendedCourse[];
  checkCourse: (id: string) => void;
  handleDepartmentChange: (value: string) => Promise<MockRegistration[]>;
  handleRegistrationChange: Dispatch<SetStateAction<ClassBlockProps[]>>;
}) => {
  const [departmentSelections, setDepartmentSelections] = useState<{
    [key: string]: string | null;
  }>({});
  const [registrationSelections, setRegistrationSelections] = useState<{
    [key: string]: string | null;
  }>({});

  const updateDepartmentSelection = (index: string, value: string) => {
    setDepartmentSelections((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const updateRegistrationSelection = (index: string, value: string) => {
    setRegistrationSelections((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const onRegistrationChange = async () => {
    const allRegistrations: ClassBlockProps[] = [];
    // eslint-disable-next-line no-console
    console.log(departmentSelections);
    for (const [key, department] of Object.entries(departmentSelections)) {
      if (department !== null) {
        try {
          const registrationsForDepartment =
            await handleDepartmentChange(department);

          registrationsForDepartment.forEach((registration) => {
            if (
              registration.registration.name === registrationSelections[key]
            ) {
              allRegistrations.push(...registration.groups);
            }
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            `Error fetching registration for department ${department}:`,
            error,
          );
        }
      }
    }
    handleRegistrationChange([...allRegistrations]);
  };

  return (
    <div className="w-full overflow-auto">
      {registrations.map((registration, index) => (
        <div key={registration.name} className="mb-4">
          <GroupsAccordion
            index={index}
            registrationName={registration.name}
            onDepartmentChange={handleDepartmentChange}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onRegistrationChange={onRegistrationChange}
            updateDepartmentSelection={(value) => {
              updateDepartmentSelection(registration.name, value);
            }}
            updateRegistrationSelection={(value) => {
              updateRegistrationSelection(registration.name, value);
            }}
          />
        </div>
      ))}
    </div>
  );
};

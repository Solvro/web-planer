import React, { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Combobox } from "@/components/ui/combobox";
import type { MockRegistration } from "@/lib/types";

const departmentOptions = [
  "Filia w Legnicy [FLG]",
  "Studium Języków Obcych [PRD/S1]",
  "Studium Wychowania Fizycznego i Sportu [PRD/S3]",
  "Politechnika Wrocławska [PWR]",
  "Wydział Architektury [W1]",
  "Wydział Mechaniczny [W10]",
  "Wydział Podstawowych Problemów Techniki [W11]",
  "Wydział Elektroniki, Fotoniki i Mikrosystemów [W12N]",
  "Wydział Matematyki [W13]",
  "Wydział Budownictwa Lądowego i Wodnego [W2]",
  "Wydział Chemiczny [W3]",
  "Wydział Informatyki i Telekomunikacji [W4N]",
  "Wydział Elektryczny [W5]",
  "Wydział Geoinżynierii, Górnictwa i Geologii [W6]",
  "Wydział Zarządzania [W8N]",
  "Wydział Mechaniczno-Energetyczny [W9]",
].sort();

export const GroupsAccordion = ({
  registrationName,
  index,
  onDepartmentChange,
  onRegistrationChange,
  updateDepartmentSelection,
  updateRegistrationSelection,
}: {
  registrationName: string;
  index: number;
  onDepartmentChange: (value: string) => Promise<MockRegistration[]>;
  onRegistrationChange: () => void;
  updateDepartmentSelection: (value: string) => void;
  updateRegistrationSelection: (value: string) => void;
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  );

  const [selectedRegistration, setSelectedRegistration] = useState<
    string | null
  >(null);

  const [showRegistrationSelect, setShowRegistrationSelect] = useState(false);

  const [registrationOptions, setRegistrationOptions] = useState<string[]>([]);

  const handleDepartmentChange = async (value: string) => {
    setSelectedDepartment(value);
    updateDepartmentSelection(value);
    const plan = await onDepartmentChange(value);
    setShowRegistrationSelect(true);
    setRegistrationOptions(plan.map((p) => p.registration.name));
  };

  const handleRegistrationChange = (value: string) => {
    setSelectedRegistration(value);
    updateRegistrationSelection(value);
    onRegistrationChange();
  };

  return (
    <div className="">
      <Accordion type="single" collapsible={true} className="">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[50px] bg-primary font-bold text-white">
                {index + 1}
              </div>
              {registrationName}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-4">
              <label
                htmlFor={`department-select-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Wybierz wydział:
              </label>
              <Combobox
                id={`department-select-${index}`}
                options={departmentOptions}
                value={selectedDepartment ?? ""}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onChange={handleDepartmentChange}
              />
            </div>

            {showRegistrationSelect ? (
              <div className="mt-4">
                <label
                  htmlFor={`registration-select-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Wybierz rejestrację:
                </label>
                <Combobox
                  id={`registration-select-${index}`}
                  options={registrationOptions}
                  value={selectedRegistration ?? ""}
                  onChange={handleRegistrationChange}
                />
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

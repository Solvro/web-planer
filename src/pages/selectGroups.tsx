import React from "react";
import { GroupsAccordion } from "@/components/Accordion";
import { Registration } from "@/lib/types";
import { extendedCourse } from "./createplan";

export default function SelectGroups({
  registrations,
  courses,
  checkCourse,
}: {
  registrations: Registration[];
  courses: extendedCourse[];
  checkCourse: (id: string) => void;
}) {
  return (
    <div className="overflow-auto">
      <h1 className="text-2xl font-semibold p-4 ">Wybierz odpowiednią turę:</h1>
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
}

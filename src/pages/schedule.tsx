import React from "react";
import { ClassSchedule } from "@/components/ClassSchedule";
import { ClassBlockProps } from "@/lib/types";
import { extendedCourse, extendedGroup } from "./createplan";

const ScheduleTest = ({
  schedule,
  courses,
  groups,
  onClick,
}: {
  schedule: ClassBlockProps[];
  courses: extendedCourse[];
  groups: extendedGroup[];
  onClick: (id: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2 overflow-auto max-h-[80vh] p-1 scrollbar-thin scrollbar-thumb-sky-900 scrollbar-track-sky-300">
      <ClassSchedule
        schedule={schedule}
        day="Poniedziałek"
        courses={courses}
        groups={groups}
        onClick={onClick}
      />
      {/* <ClassSchedule schedule={schedule} day="Wtorek" courses={courses} groups={groups} onClick={onClick} />
      <ClassSchedule schedule={schedule} day="Środa" courses={courses} groups={groups} onClick={onClick} />
      <ClassSchedule schedule={schedule} day="Czwartek" courses={courses} groups={groups} onClick={onClick} />
      <ClassSchedule schedule={schedule} day="Piątek" courses={courses} groups={groups} onClick={onClick} /> */}
    </div>
  );
};

export default ScheduleTest;

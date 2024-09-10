import React from "react";

import { ClassSchedule } from "@/components/ClassSchedule";
import type { ClassBlockProps } from "@/lib/types";
import type { ExtendedCourse, ExtendedGroup } from "@/pages/createplan/[id]";

export const ScheduleTest = ({
  schedule,
  courses,
  groups,
  onClick,
}: {
  schedule: ClassBlockProps[];
  courses: ExtendedCourse[];
  groups: ExtendedGroup[];
  onClick: (id: string) => void;
}) => {
  const filterScheduleByDay = (dayCode: string) => {
    return schedule.filter((item) => item.day === dayCode);
  };
  console.log(schedule);

  return (
    <div className="overflow-x flex flex-col gap-3 overflow-auto scrollbar-thin scrollbar-track-sky-300 scrollbar-thumb-sky-900">
      <ClassSchedule
        schedule={filterScheduleByDay("poniedzi")}
        day="Poniedziałek"
        courses={courses}
        groups={groups}
        onClick={onClick}
      />
      <ClassSchedule
        schedule={filterScheduleByDay("wtor")}
        day="Wtorek"
        courses={courses}
        groups={groups}
        onClick={onClick}
      />
      <ClassSchedule
        schedule={filterScheduleByDay("środ")}
        day="Środa"
        courses={courses}
        groups={groups}
        onClick={onClick}
      />
      <ClassSchedule
        schedule={filterScheduleByDay("czwart")}
        day="Czwartek"
        courses={courses}
        groups={groups}
        onClick={onClick}
      />
      <ClassSchedule
        schedule={filterScheduleByDay("piąt")}
        day="Piątek"
        courses={courses}
        groups={groups}
        onClick={onClick}
      />
      <ClassSchedule
        schedule={filterScheduleByDay("sobot")}
        day="Sobota"
        courses={courses}
        groups={groups}
        onClick={onClick}
      />
      <ClassSchedule
        schedule={filterScheduleByDay("niedziel")}
        day="Niedziela"
        courses={courses}
        groups={groups}
        onClick={onClick}
      />
    </div>
  );
};

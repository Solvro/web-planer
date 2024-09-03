import React from "react";

import { ReadonlyClassSchedule } from "@/components/ReadonlyClassSchedule";
import type { ClassBlockProps } from "@/lib/types";

export const ReadonlyScheduleTest = ({
  schedule,
}: {
  schedule: ClassBlockProps[];
}) => {
  return (
    <div className="flex max-h-[80vh] flex-col gap-2 overflow-auto p-1 scrollbar-thin scrollbar-track-sky-300 scrollbar-thumb-sky-900">
      <ReadonlyClassSchedule schedule={schedule} day="Poniedziałek" />
      <ReadonlyClassSchedule schedule={schedule} day="Wtorek" />
      <ReadonlyClassSchedule schedule={schedule} day="Środa" />
      <ReadonlyClassSchedule schedule={schedule} day="Czwartek" />
      <ReadonlyClassSchedule schedule={schedule} day="Piątek" />
    </div>
  );
};

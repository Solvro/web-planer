"use client";

import { Button } from "@/components/ui/button";
import { createScheduleBasedOnCoursesAndPreferences } from "@/lib/utils/schedule-algorithm";

export default function Page() {
  return (
    <div className="mt-48 flex justify-center">
      <Button
        className="p-8 text-4xl"
        onClick={() => {
          console.log(createScheduleBasedOnCoursesAndPreferences());
        }}
      >
        test algo
      </Button>
    </div>
  );
}

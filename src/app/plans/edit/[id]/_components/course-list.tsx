"use client";

import { registrationReplacer } from "@/lib/utils";
import type { ExtendedCourse, Registration } from "@/types";

import { CourseRow } from "./course-row";

export function CourseList({
  registrations,
  courses,
  collidingGroupIds,
  onToggleGroup,
  onToggleCourse,
  onRemoveRegistration,
}: {
  registrations: Registration[];
  courses: ExtendedCourse[];
  collidingGroupIds: Set<string>;
  onToggleGroup: (groupId: string) => void;
  onToggleCourse: (courseId: string, isChecked: boolean) => void;
  onRemoveRegistration: (registrationId: string) => void;
}) {
  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto">
      {registrations.map((registration) => (
        <div key={registration.id} className="mb-4">
          <div className="mb-1 flex items-center justify-between px-2">
            <p className="text-muted-foreground truncate text-xs font-semibold tracking-wide uppercase">
              {registrationReplacer(registration.name)}
            </p>
            <button
              type="button"
              onClick={() => {
                onRemoveRegistration(registration.id);
              }}
              className="text-muted-foreground hover:text-foreground shrink-0 text-xs"
            >
              Usuń
            </button>
          </div>
          {courses
            .filter((course) => course.registrationId === registration.id)
            .map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                collidingGroupIds={collidingGroupIds}
                onToggleGroup={onToggleGroup}
                onToggleCourse={(isChecked) => {
                  onToggleCourse(course.id, isChecked);
                }}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

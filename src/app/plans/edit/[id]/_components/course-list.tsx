"use client";

import { parseCatalogRegistrationId } from "@/lib/plan/catalog-courses";
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
  const facultyRegistrations = registrations.filter(
    (registration) => parseCatalogRegistrationId(registration.id) === null,
  );
  const catalogRegistrations = registrations.filter(
    (registration) => parseCatalogRegistrationId(registration.id) !== null,
  );

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto">
      {facultyRegistrations.map((registration) => (
        <RegistrationSection
          key={registration.id}
          title={registrationReplacer(registration.name)}
          registrationId={registration.id}
          courses={courses}
          collidingGroupIds={collidingGroupIds}
          onToggleGroup={onToggleGroup}
          onToggleCourse={onToggleCourse}
          onRemoveRegistration={onRemoveRegistration}
        />
      ))}
      {catalogRegistrations.length === 0 ? null : (
        <div className="mb-4">
          <p className="text-muted-foreground mb-1 px-2 text-xs font-semibold tracking-wide uppercase">
            Przedmioty
          </p>
          {catalogRegistrations.map((registration) => (
            <RegistrationSection
              key={registration.id}
              title={registration.name}
              subtitle={
                registration.departmentId === ""
                  ? null
                  : registration.departmentId
              }
              registrationId={registration.id}
              courses={courses}
              collidingGroupIds={collidingGroupIds}
              onToggleGroup={onToggleGroup}
              onToggleCourse={onToggleCourse}
              onRemoveRegistration={onRemoveRegistration}
              hideTitleWhenSingleCourse
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RegistrationSection({
  title,
  subtitle,
  registrationId,
  courses,
  collidingGroupIds,
  onToggleGroup,
  onToggleCourse,
  onRemoveRegistration,
  hideTitleWhenSingleCourse = false,
}: {
  title: string;
  subtitle?: string | null;
  registrationId: string;
  courses: ExtendedCourse[];
  collidingGroupIds: Set<string>;
  onToggleGroup: (groupId: string) => void;
  onToggleCourse: (courseId: string, isChecked: boolean) => void;
  onRemoveRegistration: (registrationId: string) => void;
  hideTitleWhenSingleCourse?: boolean;
}) {
  const sectionCourses = courses.filter(
    (course) => course.registrationId === registrationId,
  );
  const showTitle = !(hideTitleWhenSingleCourse && sectionCourses.length === 1);

  return (
    <div className="mb-4 last:mb-0">
      {showTitle ? (
        <div className="mb-1 flex items-center justify-between px-2">
          <div className="min-w-0">
            <p className="text-muted-foreground truncate text-xs font-semibold tracking-wide uppercase">
              {title}
            </p>
            {subtitle === null || subtitle === undefined ? null : (
              <p className="text-muted-foreground truncate text-[11px]">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onRemoveRegistration(registrationId);
            }}
            className="text-muted-foreground hover:text-foreground shrink-0 text-xs"
          >
            Usuń
          </button>
        </div>
      ) : (
        <div className="mb-1 flex items-center justify-end px-2">
          {subtitle === null || subtitle === undefined ? null : (
            <p className="text-muted-foreground mr-auto truncate text-[11px]">
              {subtitle}
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              onRemoveRegistration(registrationId);
            }}
            className="text-muted-foreground hover:text-foreground shrink-0 text-xs"
          >
            Usuń
          </button>
        </div>
      )}
      {sectionCourses.map((course) => (
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
  );
}

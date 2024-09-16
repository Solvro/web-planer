import { atomFamily, atomWithStorage } from "jotai/utils";

import type { ClassBlockProps, Course, Registration } from "@/lib/types";

export interface ExtendedCourse extends Course {
  isChecked: boolean;
  groups: ExtendedGroup[];
}

export interface ExtendedGroup extends ClassBlockProps {
  isChecked: boolean;
}

export const planFamily = atomFamily(
  ({ id }: { id: number }) =>
    atomWithStorage(
      `${id}-plan`,
      {
        id,
        name: `Nowy plan - ${id}`,
        courses: [] as ExtendedCourse[],
        registrations: [] as Registration[],
      },
      undefined,
      { getOnInit: true },
    ),
  (a, b) => a.id === b.id,
);

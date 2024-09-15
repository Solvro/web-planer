import { atomFamily, atomWithStorage } from "jotai/utils";

import type { ClassBlockProps, Course } from "@/lib/types";

export interface ExtendedCourse extends Course {
  isChecked: boolean;
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
        courses: [] as Course[],
        groups: [] as ExtendedGroup[],
      },
      undefined,
      { getOnInit: true },
    ),
  (a, b) => a.id === b.id,
);

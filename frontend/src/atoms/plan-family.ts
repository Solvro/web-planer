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
  ({ id }: { id: string }) =>
    atomWithStorage(
      `${id}-plan-v2`,
      {
        id,
        name: `Nowy plan`,
        sharedId: null as string | null,
        courses: [] as ExtendedCourse[],
        registrations: [] as Registration[],
        createdAt: new Date(),
        updatedAt: new Date(),
        onlineId: null as string | null,
        toCreate: true as boolean,
        synced: false,
      },
      undefined,
      { getOnInit: true },
    ),
  (a, b) => a.id === b.id,
);

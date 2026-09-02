import { atomWithStorage } from "jotai/utils";

export const selectedFacultyAtom = atomWithStorage<string | null>(
  "selectedFaculty",
  null,
);

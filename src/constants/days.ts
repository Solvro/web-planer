import { Day } from "@/types";

export const DAYS: { day: Day; label: string }[] = [
  { day: Day.MONDAY, label: "Poniedziałek" },
  { day: Day.TUESDAY, label: "Wtorek" },
  { day: Day.WEDNESDAY, label: "Środa" },
  { day: Day.THURSDAY, label: "Czwartek" },
  { day: Day.FRIDAY, label: "Piątek" },
];

export const WEEKEND_DAYS: { day: Day; label: string }[] = [
  { day: Day.SATURDAY, label: "Sobota" },
  { day: Day.SUNDAY, label: "Niedziela" },
];

export const ALL_DAYS: { day: Day; label: string }[] = [
  ...DAYS,
  ...WEEKEND_DAYS,
];

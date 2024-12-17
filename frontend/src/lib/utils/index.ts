import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const registrationReplacer = (name: string) => {
  const newName = name
    .replace("W04 zapisy wydziałowe dla kierunku", "")
    .replace("zapisy wydziałowe na ", "")
    .replace("W04 ", "")
    .replace("2024/25-Z", "")
    .trim();
  return newName.charAt(0).toUpperCase() + newName.slice(1);
};

export function pluralize(
  number: number,
  singular: string,
  plural: string,
  genitivePlural: string,
): string {
  const newNumber = Math.abs(number); // only if negative numbers can occur
  if (newNumber === 1) {
    return singular;
  }
  const remainder10 = newNumber % 10;
  const remainder100 = newNumber % 100;
  if (
    remainder10 > 4 ||
    remainder10 < 2 ||
    (remainder100 < 15 && remainder100 > 11)
  ) {
    return genitivePlural;
  }
  return plural;
}

import { type ClassValue, clsx } from "clsx";
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

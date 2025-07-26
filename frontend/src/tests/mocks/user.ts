import type { User } from "@/types";

export function generateMockUser(): User {
  const id = Math.floor(Math.random() * 100_000);
  const timestamp = new Date().toISOString();

  return {
    id,
    firstName: `Test${id.toString()}`,
    lastName: "User",
    studentNumber: 100_000 + id,
    usosId: id.toString(),
    verified: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    allowNotifications: true,
  };
}

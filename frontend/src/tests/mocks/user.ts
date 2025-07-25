import { User } from "@/types";

export function generateMockUser(): User {
  const id = Math.floor(Math.random() * 100000);
  const timestamp = new Date().toISOString();

  return {
    id,
    firstName: `Test${id}`,
    lastName: "User",
    studentNumber: 100000 + id,
    usosId: `${id}`,
    verified: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    allowNotifications: true,
  };
}

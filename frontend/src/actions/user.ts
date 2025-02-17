"use server";

import { auth, fetchToAdonis } from "@/lib/auth";
import type { UserSettingsPayload } from "@/types";

export const getCurrentUser = async () => {
  const user = await auth({ type: "adonis" });
  if (user == null) {
    throw new Error("Not logged in");
  }
  return user;
};

interface UpdateUserSettingsResponse {
  message: string;
  user: number;
  success: boolean;
}

export const updateUser = async (payload: UserSettingsPayload) => {
  const user = await auth({ type: "adonis" });
  if (user == null) {
    throw new Error("Not logged in");
  }

  // Update user
  const data = await fetchToAdonis<UpdateUserSettingsResponse>({
    url: "/user",
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (data === null) {
    throw new Error("Failed to update user");
  }

  return { success: true };
};

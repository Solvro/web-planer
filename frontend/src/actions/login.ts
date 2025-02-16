"use server";

import type { z } from "zod";

import { fetchToAdonis } from "@/lib/auth";
import { loginOtpEmailSchema } from "@/types/schemas";

export const sendOtpToEmail = async (
  values: z.infer<typeof loginOtpEmailSchema>,
) => {
  const validatedFields = loginOtpEmailSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = await fetchToAdonis<{ success: boolean; message: string }>({
    url: `/user/get_otp`,
    method: "POST",
    body: JSON.stringify(values),
  });

  if (data == null) {
    return {
      success: false,
      errors: { email: "Nie udało się wysłać maila" },
    };
  }

  return data;
};

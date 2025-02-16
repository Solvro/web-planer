"use server";

import { cookies as cookiesPromise } from "next/headers";
import type { z } from "zod";

import { ADONIS_COOKIES } from "@/constants";
import { env } from "@/env.mjs";
import { fetchToAdonis } from "@/lib/auth";
import type { VerifyOtpReponseType } from "@/types";
import { loginOtpEmailSchema, otpPinSchema } from "@/types/schemas";

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

export const verifyOtp = async (
  email: string,
  values: z.infer<typeof otpPinSchema>,
) => {
  const validatedFields = otpPinSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const cookies = await cookiesPromise();

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/user/verify_otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, ...values }),
  });

  const data = (await response.json()) as VerifyOtpReponseType;

  if (!data.success) {
    return {
      success: false,
      errors: { pin: "Nieprawidłowy kod" },
    };
  }

  try {
    const setCookieHeaders = response.headers.getSetCookie();
    for (const cookie of setCookieHeaders) {
      const preparedCookie = cookie.split(";")[0];
      const [name, value] = preparedCookie.split("=");
      if (name === "XSRF-TOKEN") {
        cookies.set({
          name,
          value,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
          secure: true,
          sameSite: "lax",
        });
      } else if (ADONIS_COOKIES.has(name)) {
        cookies.set({
          name,
          value,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
      }
    }
  } catch {}

  return data;
};

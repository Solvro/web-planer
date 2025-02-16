import { z } from "zod";

export const feedbackFormSchema = z.object({
  email: z.string().email(),
  title: z.string(),
  description: z.string(),
});

const emailWithDomainRegex = /^[a-zA-Z0-9._%+-]+@(student\.)?pwr\.edu\.pl$/;
export const loginOtpEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Niepoprawny email" })
    .regex(emailWithDomainRegex, {
      message: "Email musi być z domeny Politechniki Wrocławskiej",
    }),
});

export const otpPinSchema = z.object({
  otp: z.string().min(6, {
    message: "Kod musi mieć 6 znaków",
  }),
});

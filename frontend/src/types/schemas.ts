import { z } from "zod";

export const feedbackFormSchema = z.object({
  email: z.string().email("Niepoprawny email"),
  title: z.string().min(1, "Za krótki tytuł!"),
  description: z.string().min(1, "Za krótki opis!"),
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

export const userDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

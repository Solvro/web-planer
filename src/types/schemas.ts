import * as z from "zod";

export const feedbackFormSchema = z.object({
  email: z.email(),
  title: z.string().trim(),
  description: z.string().trim(),
});

const emailWithDomainRegex = /^[\w.%+-]+@(student\.)?pwr\.edu\.pl$/;
const staffEmailWithIndexRegex = /^\d+@pwr\.edu\.pl$/;
export const loginOtpEmailSchema = z.object({
  email: z
    .email({ message: "Niepoprawny email" })
    .regex(emailWithDomainRegex, {
      message: "Email musi być z domeny Politechniki Wrocławskiej",
    })
    .refine((email) => !staffEmailWithIndexRegex.test(email), {
      error:
        "Studenci logują się mailem z domeny student.pwr.edu.pl, nie pwr.edu.pl",
    }),
});

export const otpPinSchema = z.object({
  otp: z.string().trim().min(6, {
    message: "Kod musi mieć 6 znaków",
  }),
});

export const userDataSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  email: z.email(),
});

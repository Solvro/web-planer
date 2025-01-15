import { z } from "zod";

export const feedbackFormSchema = z.object({
  email: z.string().email(),
  title: z.string(),
  description: z.string(),
});

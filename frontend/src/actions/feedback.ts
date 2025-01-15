"use server";

import type { z } from "zod";

import { env } from "@/env.mjs";
import { feedbackFormSchema } from "@/types/schema";

export const sendFeedbackForm = async (
  values: z.infer<typeof feedbackFormSchema>,
) => {
  try {
    feedbackFormSchema.parse(values);
    const googleFormUrl = env.FORMS_LINK;

    const formData = new URLSearchParams();
    formData.append(env.FORMS_FIELD_EMAIL, values.email);
    formData.append(env.FORMS_FIELD_TITLE, values.title);
    formData.append(env.FORMS_FIELD_DESCRIPTION, values.description);

    const response = await fetch(googleFormUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Obsługa odpowiedzi
    if (response.ok) {
      return true;
    } else {
      console.error("Error while sending feedback form", response);
    }
  } catch (error) {
    console.error("Error while sending feedback form", error);
  }
};

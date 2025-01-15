import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    USOS_CONSUMER_KEY: z.string().min(1),
    USOS_CONSUMER_SECRET: z.string().min(1),
    USOS_APPS_URL: z.string().url().default("https://apps.usos.pwr.edu.pl"),
    SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api"),
    FORMS_LINK: z.string().url().default("https://forms.gle/"),
    FORMS_FIELD_EMAIL: z.string().default("entry.1234567890"),
    FORMS_FIELD_TITLE: z.string().default("entry.1234567890"),
    FORMS_FIELD_DESCRIPTION: z.string().default("entry.1234567890"),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    USOS_APPS_URL: process.env.USOS_APPS_URL,
    USOS_CONSUMER_KEY: process.env.USOS_CONSUMER_KEY,
    USOS_CONSUMER_SECRET: process.env.USOS_CONSUMER_SECRET,
    FORMS_LINK: process.env.FORMS_LINK,
    FORMS_FIELD_EMAIL: process.env.FORMS_FIELD_EMAIL,
    FORMS_FIELD_TITLE: process.env.FORMS_FIELD_TITLE,
    FORMS_FIELD_DESCRIPTION: process.env.FORMS_FIELD_DESCRIPTION,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});

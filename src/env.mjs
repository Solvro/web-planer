import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
    DATABASE_URL: z.string().url(),
    USOS_CONSUMER_KEY: z.string().min(1),
    USOS_CONSUMER_SECRET: z.string().min(1),
    USOS_APPS_URL: z.string().url().default("https://apps.usos.pwr.edu.pl"),
    SITE_URL: z.string().url().default("http://localhost:3000"),
    FORMS_LINK: z.string().url().default("https://forms.gle/"),
    FORMS_FIELD_EMAIL: z.string().default("entry.1234567890"),
    FORMS_FIELD_TITLE: z.string().default("entry.1234567890"),
    FORMS_FIELD_DESCRIPTION: z.string().default("entry.1234567890"),
    GITHUB_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_ALERTS_APP_CODE: z.string().min(1).default("planer"),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ALERTS_APP_CODE: process.env.NEXT_PUBLIC_ALERTS_APP_CODE,
    USOS_APPS_URL: process.env.USOS_APPS_URL,
    USOS_CONSUMER_KEY: process.env.USOS_CONSUMER_KEY,
    USOS_CONSUMER_SECRET: process.env.USOS_CONSUMER_SECRET,
    FORMS_LINK: process.env.FORMS_LINK,
    FORMS_FIELD_EMAIL: process.env.FORMS_FIELD_EMAIL,
    FORMS_FIELD_TITLE: process.env.FORMS_FIELD_TITLE,
    FORMS_FIELD_DESCRIPTION: process.env.FORMS_FIELD_DESCRIPTION,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});

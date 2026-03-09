/* eslint-disable @typescript-eslint/no-unsafe-return */
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
    GITHUB_TOKEN: z.string().optional(),
    SEMESTER_START: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    SEMESTER_END: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    HOLIDAY_START: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    HOLIDAY_END: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    REFERENCE_WEEK_DATE: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    REFERENCE_WEEK_DATE_IS_EVEN: z
      .enum(["true", "false"])
      .transform((v) => v === "true"),

    FREE_DAYS_JSON: z
      .string()
      .transform((string_, context) => {
        try {
          return JSON.parse(string_);
        } catch {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid JSON in FREE_DAYS_JSON",
          });
          return z.NEVER;
        }
      })
      .pipe(
        z.array(
          z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            description: z.string(),
          }),
        ),
      ),

    OVERRIDES_JSON: z
      .string()
      .transform((string_, context) => {
        try {
          return JSON.parse(string_);
        } catch {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid JSON in OVERRIDES_JSON",
          });
          return z.NEVER;
        }
      })
      .pipe(
        z.array(
          z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            day: z.enum([
              "poniedziałek",
              "wtorek",
              "środa",
              "czwartek",
              "piątek",
            ]),
            week: z.enum(["odd", "even"]),
          }),
        ),
      ),
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
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    SEMESTER_START: process.env.SEMESTER_START,
    SEMESTER_END: process.env.SEMESTER_END,
    HOLIDAY_START: process.env.HOLIDAY_START,
    HOLIDAY_END: process.env.HOLIDAY_END,
    REFERENCE_WEEK_DATE: process.env.REFERENCE_WEEK_DATE,
    REFERENCE_WEEK_DATE_IS_EVEN: process.env.REFERENCE_WEEK_DATE_IS_EVEN,
    FREE_DAYS_JSON: process.env.FREE_DAYS_JSON,
    OVERRIDES_JSON: process.env.OVERRIDES_JSON,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});

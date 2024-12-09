import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    USOS_CONSUMER_KEY: z.string().min(1),
    USOS_CONSUMER_SECRET: z.string().min(1),
    USOS_BASE_URL: z.string().startsWith("usos").default("usos.pwr.edu.pl"),
    SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api"),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    USOS_BASE_URL: process.env.USOS_BASE_URL,
    USOS_CONSUMER_KEY: process.env.USOS_CONSUMER_KEY,
    USOS_CONSUMER_SECRET: process.env.USOS_CONSUMER_SECRET,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});

export const USOS_APPS_URL = `https://apps.${env.USOS_BASE_URL}`;

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    USOS_CONSUMER_KEY: z.string().min(1),
    USOS_CONSUMER_SECRET: z.string().min(1),
    USOS_BASE_URL: z.string().startsWith("usos").default("usos.pwr.edu.pl"),
    SITE_URL: z.string().url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    SITE_URL: process.env.SITE_URL,
    USOS_BASE_URL: process.env.USOS_BASE_URL,
    USOS_CONSUMER_KEY: process.env.USOS_CONSUMER_KEY,
    USOS_CONSUMER_SECRET: process.env.USOS_CONSUMER_SECRET,
  },
});

export const USOS_APPS_URL = `https://apps.${env.USOS_BASE_URL}`;

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});

import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

// eslint-disable-next-line unicorn/prevent-abbreviations
export const db = drizzle({
  connection: { connectionString: process.env.DATABASE_URL ?? "", ssl: false },
  schema,
});

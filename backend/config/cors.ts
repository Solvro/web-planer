import { defineConfig } from "@adonisjs/cors";

// import env from "#start/env";

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  // origin: env.get("CORS_ORIGIN", "planer.solvro.pl").split(","),
  origin: [
    "http://localhost:3000",
    "https://planer.solvro.pl",
    "planer.solvro.pl",
    "localhost:3000",
  ],
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
});

export default corsConfig;

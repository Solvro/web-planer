import type { KnipConfig } from "knip";

const config = {
  ignore: [
    "src/components/ui/**",
    "next-sitemap.config.js",
    "lint-staged.config.mjs",
    "src/components/class-block-stars.tsx",
    "src/lib/usos.ts",
    "src/services/usos/**",
  ],
  // sharp is used in nextjs image optimization
  ignoreDependencies: [
    "sharp",
    "@radix-ui/*",
    "eslint",
    "cheerio",
    "fetch-cookie",
    "node-fetch",
    "lru-cache",
  ],
} satisfies KnipConfig;

export default config;

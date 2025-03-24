import type { KnipConfig } from "knip";

const config = {
  ignore: [
    "src/components/ui/**",
    "next-sitemap.config.js",
    "lint-staged.config.mjs",
    "src/types/index.ts",
    "src/robots.ts",
    "src/sitemap.ts",
  ],
  // sharp is used in nextjs image optimization
  ignoreDependencies: ["sharp", "eslint"],
} satisfies KnipConfig;

export default config;

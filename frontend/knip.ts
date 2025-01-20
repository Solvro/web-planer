import type { KnipConfig } from "knip";

const config = {
  ignore: [
    "src/components/ui/**",
    "next-sitemap.config.js",
    "lint-staged.config.mjs",
    "src/components/class-block-stars.tsx",
  ],
  // sharp is used in nextjs image optimization
  ignoreDependencies: ["sharp", "@radix-ui/*", "eslint"],
} satisfies KnipConfig;

export default config;

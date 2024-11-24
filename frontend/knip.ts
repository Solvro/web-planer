import type { KnipConfig } from "knip";

const config = {
  ignore: [
    "src/components/ui/**",
    "next-sitemap.config.js",
    "src/components/SharePlanResponsiveDialog.tsx",
    "src/lib/sharingUtils.ts",
    "lint-staged.config.mjs",
  ],
  // sharp is used in nextjs image optimization
  ignoreDependencies: ["sharp", "@radix-ui/*", "eslint-config-next"],
} satisfies KnipConfig;

export default config;

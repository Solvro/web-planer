import type { KnipConfig } from "knip";

const config = {
  ignore: [
    "src/components/ui/**",
    "next-sitemap.config.js",
    "src/components/SharePlanResponsiveDialog.tsx",
    "src/lib/sharingUtils.ts",
  ],
  // sharp is used in nextjs image optimization
  ignoreDependencies: ["sharp", "@radix-ui/*"],
} satisfies KnipConfig;

export default config;

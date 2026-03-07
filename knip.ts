import type { KnipConfig } from "knip";

const config = {
  ignore: [
    "src/components/ui/**",
    "next-sitemap.config.js",
    "lint-staged.config.mjs",
    "src/types/index.ts",
    "src/robots.ts",
    "src/sitemap.ts",
    "src/actions/user.ts",
    "src/app/plans/_components/notifications-form.tsx",
  ],
  // sharp is used in nextjs image optimization
  ignoreDependencies: ["sharp", "eslint"],
} satisfies KnipConfig;

export default config;

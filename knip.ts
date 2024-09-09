import type { KnipConfig } from "knip";

const config = {
  ignore: ["src/components/ui/**", "next-sitemap.config.js"],
  // sharp is used in nextjs image optimization
  ignoreDependencies: ["sharp", "@radix-ui/*", "three.js"],
} satisfies KnipConfig;

export default config;

import type { KnipConfig } from "knip";

const config = {
  ignore: ["src/components/ui/**"],
  // sharp is used in nextjs image optimization
  ignoreDependencies: ["sharp", "@radix-ui/*"],
} satisfies KnipConfig;

// eslint-disable-next-line import/no-default-export
export default config;

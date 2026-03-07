import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "github.com",
      },
    ],
  },
  reactStrictMode: true,
  output: "standalone",
};

export default nextConfig;

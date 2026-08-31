import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "github.com",
      },
    ],
    qualities: [75, 100],
  },
  reactStrictMode: true,
};

export default nextConfig;

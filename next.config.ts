import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        hostname: "github.com",
      },
    ],
    qualities: [75, 100],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["github.com"],
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

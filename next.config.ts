// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // WARNING: This will skip ESLint entirely during `next build`!
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;

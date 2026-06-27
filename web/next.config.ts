import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },{
        protocol: "https",
        hostname: "pub-2ad03dc6c68c4967aa75d7fd2920e6f6.r2.dev",
      }
    ],
  },
};

export default nextConfig;
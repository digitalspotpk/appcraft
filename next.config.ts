import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Firebase Storage and ImgBB
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
      {
        protocol: "https",
        hostname: "foodhub-backend-silk.vercel.app",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    unoptimized: true, // Required for local development with private IP backend serving
  },
  async rewrites() {
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://foodhub-backend-silk.vercel.app/api";
    // Ensure we don't use localhost in production rewrites
    const finalDest = (process.env.NODE_ENV === "production" && backendApiUrl.includes("localhost"))
      ? "https://foodhub-backend-silk.vercel.app/api"
      : backendApiUrl;

    return [
      {
        source: "/api/:path*",
        destination: `${finalDest}/:path*`,
      },
    ];
  },
};

export default nextConfig;

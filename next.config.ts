import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drivehub-uploads.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "drivehub-uploads.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.facebook.com",
      },
    ],
  },
};

export default nextConfig;

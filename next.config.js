/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;

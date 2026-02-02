/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // AWS S3
      {
        protocol: "https",
        hostname: "drivehub-uploads.s3.*.amazonaws.com",
        pathname: "/**",
      },
      // Pexels
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

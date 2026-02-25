import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fcom-micro-saas.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/ed-tech/**',
      },
    ],
  },
};

export default nextConfig;

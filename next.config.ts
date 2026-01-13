import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sujeitoprogramador.com'
      }
    ],
    qualities: [50, 75, 100]
  }
};

export default nextConfig;

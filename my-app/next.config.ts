import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignorujemy błędy typów (np. brakujące definicje) podczas budowania
    ignoreBuildErrors: true,
  },
  images: {
    // Pozwalamy na ładowanie zdjęć z Discorda
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
  },
};

export default nextConfig;
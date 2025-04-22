// Dans next.config.ts
import type { NextConfig } from "next";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Autres configurations existantes
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, 'src')
    };
    return config;
  },
};

export default nextConfig;
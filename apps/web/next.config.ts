// Purpose: Configure the Next.js app while keeping framework defaults intact.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
};

export default nextConfig;

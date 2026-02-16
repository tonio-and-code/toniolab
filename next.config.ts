import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Server-side rendering for API routes + D1 */
  typescript: {
    // Match iwasaki-naisou config - multiple files declare global Window
    // with conflicting YG/YT modifiers (optional vs required)
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

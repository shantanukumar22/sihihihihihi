import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // Disable file tracing to avoid EPERM errors
  outputFileTracingRoot: undefined,
  // Disable static optimization for problematic pages
  trailingSlash: false,
  // Add webpack configuration to handle file system issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('fs');
    }
    return config;
  }
};

export default nextConfig;

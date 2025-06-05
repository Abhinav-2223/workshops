import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // disable caching
  cacheMaxMemorySize: 0,
  output: "standalone",
};

export default nextConfig;

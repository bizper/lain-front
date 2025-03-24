import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/web',
  trailingSlash: true,
  /* config options here */
  output: 'export'
};

export default nextConfig;

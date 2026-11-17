import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* Ship the seeded demo database inside serverless bundles (Vercel etc.) */
  outputFileTracingIncludes: {
    "/**": ["./db/custom.db"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
};

export default nextConfig;

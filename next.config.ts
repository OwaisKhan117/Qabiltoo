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
    /* Prefer the most efficient modern formats for every optimized image */
    formats: ["image/avif", "image/webp"],
  },
  /* Long-lived caching for hashed build assets (default) + explicit
     caching for public static assets (images, logo marks). */
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:file(svg|png|webp|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

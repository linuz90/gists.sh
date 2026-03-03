import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes (belt-and-suspenders for paths that bypass proxy)
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // CDN caching for gist pages (20-char or 32-char hex IDs).
        // No stale-while-revalidate so on-demand purge via revalidateTag
        // serves fresh content immediately instead of stale.
        source: "/:user/:gistId([a-f0-9]{20,32})",
        headers: [
          {
            key: "Vercel-CDN-Cache-Control",
            value: "public, s-maxage=86400",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

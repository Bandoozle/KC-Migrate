import type { NextConfig } from "next";

const wordpressOrigin =
  process.env.WORDPRESS_URL?.replace(/\/+$/, "") ??
  "https://staging.kosick.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staging.kosick.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "staging.kosick.com",
        pathname: "/wp-includes/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/wp-content/:path*",
        destination: `${wordpressOrigin}/wp-content/:path*`,
      },
      {
        source: "/wp-includes/:path*",
        destination: `${wordpressOrigin}/wp-includes/:path*`,
      },
    ];
  },
};

export default nextConfig;

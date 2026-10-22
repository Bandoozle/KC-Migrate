import type { NextConfig } from "next";

const wordpressOrigin =
  process.env.WORDPRESS_URL?.replace(/\/+$/, "") ??
  "https://staging.kosick.com";

const nextConfig: NextConfig = {
  trailingSlash: true,
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
      {
        protocol: "https",
        hostname: "www.kosick.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "www.kosick.com",
        pathname: "/wp-includes/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/ga4-new-generation-google-analytics",
        destination: "/services/search-engine-optimization/",
        permanent: true,
      },
      {
        source: "/corporate-events-group-travel",
        destination: "/corporate-events/",
        permanent: true,
      },
    ];
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

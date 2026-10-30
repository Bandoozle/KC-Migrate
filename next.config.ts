import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/lib/legacy-redirects";

// WordPress media is served from public/wp-content/ at its original paths, so
// no request for an image or video goes to WordPress.
const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return LEGACY_REDIRECTS.map((entry) => ({ ...entry, permanent: true }));
  },
};

export default nextConfig;

import type { Metadata } from "next";
import { headers } from "next/headers";
import { getPostBySlug } from "@/lib/wordpress";
import { getWordPressBodyClass } from "@/lib/wordpress-body-class";
import "./globals.css";
import "@/styles/wordpress-compat.css";

export const metadata: Metadata = {
  title: "Kosick Communications",
  description:
    "Next.js frontend for Kosick Communications, using the WordPress staging site as the content source.",
};

/** Exact native routes (do not treat child paths as native). */
const NATIVE_PAGE_EXACT = new Set([
  "/",
  "/services",
  "/thanks",
  "/online-payments",
  "/site-map",
  "/feature-articles",
  "/marketing-results",
  "/marketing-programs",
  "/corporate-events",
  "/contact",
  "/comfortmaker",
  "/uncorked",
  "/mexico-2026-welcome-itinerary",
  "/services/hvac-marketing",
  "/services/hvac-marketing/hvac-lead-generation",
  "/services/dental-marketing",
  "/services/golf-marketing",
  "/services/outdoor-advertising/billboard-dimensions",
]);

/** Prefix-matched native routes (page + nested paths). */
const NATIVE_PAGE_PREFIXES = [
  "/services/digital-marketing",
  "/services/email-marketing",
  "/services/social-media-marketing",
  "/services/search-engine-optimization",
  "/services/radio-advertising",
  "/services/television-advertising",
  "/services/outdoor-advertising",
  "/services/digital-connected-tv",
  "/services/business-development",
  "/services/creative",
  "/services/corporate-branding",
  "/services/website-development",
];

async function isNativePage(pathname: string): Promise<boolean> {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (NATIVE_PAGE_EXACT.has(normalized)) return true;
  if (
    NATIVE_PAGE_PREFIXES.some(
      (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
    )
  ) {
    return true;
  }

  // Published blog posts render through the native article template at /{slug}/.
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 1) {
    const post = await getPostBySlug(segments[0]);
    if (post) return true;
  }

  return false;
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = (await headers()).get("x-pathname") || "/";
  const bodyClass = (await isNativePage(pathname))
    ? "kosick-native"
    : await getWordPressBodyClass(pathname);

  return (
    <html lang="en-US">
      <body className={bodyClass} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

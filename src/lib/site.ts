/** Public production site. Read-only source for SEO, sitemap, and the KML file. */
export const PRODUCTION_SITE_ORIGIN = "https://www.kosick.com";

export const LIVE_WORDPRESS_ORIGIN = PRODUCTION_SITE_ORIGIN;

export const SITE_ORIGINS = [
  "https://www.kosick.com",
  "https://kosick.com",
  "http://www.kosick.com",
  "http://kosick.com",
] as const;

const PRODUCTION_HOSTS = new Set(["www.kosick.com", "kosick.com"]);

export function requestHostname(hostHeader: string | null | undefined): string {
  return (hostHeader || "").split(",")[0]?.trim().split(":")[0]?.toLowerCase() || "";
}

/** True only for the real marketing domain, never a Vercel preview hostname. */
export function isProductionHost(hostname: string | null | undefined): boolean {
  return PRODUCTION_HOSTS.has(requestHostname(hostname));
}

export function matchesOrigin(url: string, origin: string): boolean {
  if (!origin || !url.startsWith(origin)) return false;
  const next = url.charAt(origin.length);
  return next === "" || next === "/" || next === "?" || next === "#";
}

/** Canonical path with a trailing slash, matching the live WordPress URLs. */
export function canonicalPath(path: string): string {
  const trimmed = (path || "/").trim();
  if (!trimmed || trimmed === "/") return "/";
  const withLead = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const pathname = withLead.split("?")[0]?.split("#")[0] || "/";
  if (pathname === "/") return "/";
  if (pathname.endsWith("/")) return pathname;
  if (/\.[a-z0-9]+$/i.test(pathname)) return pathname;
  return `${pathname}/`;
}

export function canonicalUrl(path: string): string {
  const pathname = canonicalPath(path);
  return pathname === "/" ? `${PRODUCTION_SITE_ORIGIN}/` : `${PRODUCTION_SITE_ORIGIN}${pathname}`;
}

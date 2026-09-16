import { hydrateKadenceCountupHtml } from "@/lib/wordpress-countup";
import { hydrateKadenceTabsHtml } from "@/lib/wordpress-tabs";
import { getWordPressUrl } from "@/lib/wordpress";

const WORDPRESS_ASSET_PREFIXES = [
  "/wp-content/",
  "/wp-includes/",
  "/wp-json/",
  "/wp-admin/",
  "/wp-login.php",
  "/cdn-cgi/",
];

const FONT_FILE_PATTERN = /\.(?:woff2?|ttf|otf|eot)(?:$|\?|#)/i;
const HTML_URL_ATTRS = [
  "src",
  "href",
  "poster",
  "data-src",
  "data-lazy",
  "data-desktop",
  "data-tablet",
  "data-mobile",
  "data-image",
  "data-background",
  "data-full-res",
].join("|");

export function isWordPressAssetPath(pathname: string): boolean {
  return WORDPRESS_ASSET_PREFIXES.some(
    (prefix) => pathname === prefix.replace(/\/+$/, "") || pathname.startsWith(prefix),
  );
}

function originHost(origin: string): string {
  return new URL(origin).host;
}

function isBareFilename(value: string): boolean {
  return (
    !/^https?:\/\//i.test(value) &&
    !value.startsWith("/") &&
    !value.startsWith("data:") &&
    !value.startsWith("blob:") &&
    !value.startsWith("mailto:") &&
    !value.startsWith("tel:") &&
    !value.startsWith("#")
  );
}

/**
 * Normalize a single WordPress asset URL without inventing hostnames.
 *
 * - https://staging.kosick.com/wp-content/... → preserve
 * - /wp-content/... → https://staging.kosick.com/wp-content/...
 * - //staging.kosick.com/wp-content/... → https://staging.kosick.com/wp-content/...
 * - /wp-content/fonts/{family}/{file}.woff2 → /wp-fonts/{family}/{file}.woff2
 * - bare filenames are left unchanged
 */
export function normalizeWordPressAssetUrl(raw: string, origin = getWordPressUrl()): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }

  if (isBareFilename(trimmed) && !trimmed.startsWith("//")) {
    return trimmed;
  }

  const base = origin.replace(/\/+$/, "");
  let parsed: URL;
  try {
    if (trimmed.startsWith("//")) {
      parsed = new URL(`https:${trimmed}`);
    } else if (trimmed.startsWith("/")) {
      parsed = new URL(trimmed, `${base}/`);
    } else {
      parsed = new URL(trimmed);
    }
  } catch {
    return trimmed;
  }

  if (parsed.hostname !== originHost(base)) {
    return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
  }

  const localFont = toLocalFontPath(parsed.pathname);
  if (localFont) {
    return `${localFont}${parsed.search}${parsed.hash}`;
  }

  if (FONT_FILE_PATTERN.test(parsed.pathname) && parsed.pathname.startsWith("/wp-content/themes/")) {
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }

  if (isWordPressAssetPath(parsed.pathname)) {
    return parsed.href;
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  return parsed.href;
}

export function toLocalFontPath(pathname: string): string | null {
  const match = pathname.match(/^\/wp-content\/fonts\/([^/]+)\/([^/]+)$/i);
  if (!match || !FONT_FILE_PATTERN.test(match[2])) return null;
  return `/wp-fonts/${match[1]}/${match[2]}`;
}

export function isWordPressFontStylesheet(href: string): boolean {
  try {
    const pathname = href.startsWith("http") || href.startsWith("//")
      ? new URL(href.startsWith("//") ? `https:${href}` : href).pathname
      : href.split("?")[0];
    return /^\/wp-content\/fonts\/[^/]+\.css$/i.test(pathname);
  } catch {
    return /\/wp-content\/fonts\/[^/]+\.css/i.test(href);
  }
}

export function normalizeSrcset(value: string, origin = getWordPressUrl()): string {
  return value
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return part;
      const [url, ...descriptors] = trimmed.split(/\s+/);
      const next = normalizeWordPressAssetUrl(url, origin);
      return [next, ...descriptors].join(" ");
    })
    .join(", ");
}

export function wordpressUrlToNextPath(href: string, origin = getWordPressUrl()): string {
  const trimmed = href.trim();
  if (!trimmed || trimmed === "#") return "#";
  if (
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }

  try {
    const base = origin.replace(/\/+$/, "");
    const url = new URL(trimmed, `${base}/`);

    if (url.origin !== new URL(base).origin) {
      return trimmed;
    }

    if (isWordPressAssetPath(url.pathname)) {
      return normalizeWordPressAssetUrl(url.href, origin);
    }

    const path = url.pathname.replace(/\/+$/, "") || "/";
    return `${path}${url.search}${url.hash}`;
  } catch {
    return trimmed;
  }
}

export function rewriteInternalWordPressHrefs(html: string, origin: string): string {
  const base = origin.replace(/\/+$/, "");
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const absolutePattern = new RegExp(`href=(['"])${escaped}([^'"]*)\\1`, "gi");

  return html.replace(absolutePattern, (_full, quote: string, rest: string) => {
    const absolute = `${base}${rest || "/"}`;
    const next = wordpressUrlToNextPath(absolute, origin);
    return `href=${quote}${next}${quote}`;
  });
}

export function absolutizeWordPressAssetUrls(html: string, origin: string): string {
  return html
    .replace(
      new RegExp(`\\b(${HTML_URL_ATTRS})=(['"])([^'"]*)\\2`, "gi"),
      (_full, attr: string, quote: string, value: string) =>
        `${attr}=${quote}${normalizeWordPressAssetUrl(value, origin)}${quote}`,
    )
    .replace(
      /\b(srcset|data-srcset)=(['"])([^'"]*)\2/gi,
      (_full, attr: string, quote: string, value: string) =>
        `${attr}=${quote}${normalizeSrcset(value, origin)}${quote}`,
    );
}

export function rewriteInlineCssAssetUrls(css: string, origin: string): string {
  return css.replace(/url\((['"]?)([^'")]+)\1\)/gi, (_full, quote: string, raw: string) => {
    const next = normalizeWordPressAssetUrl(raw.trim(), origin);
    return `url(${quote}${next}${quote})`;
  });
}

/**
 * Vimeo background embeds stay in the original iframe. Domain-restricted
 * videos (e.g. 911448655) return 403 on localhost until the preview host is
 * authorized in Vimeo. That is expected and must not be bypassed.
 */
export function enhanceVimeoBackgroundEmbeds(html: string): string {
  return html.replace(
    /<iframe\b([^>]*player\.vimeo\.com\/video\/\d+[^>]*)>/gi,
    (match, attrs: string) => {
      let tag = match;

      if (!/\ballow=/i.test(attrs)) {
        tag = tag.replace(
          "<iframe",
          '<iframe allow="autoplay; fullscreen; picture-in-picture"',
        );
      }

      if (!/\breferrerpolicy=/i.test(attrs)) {
        tag = tag.replace(
          "<iframe",
          '<iframe referrerpolicy="strict-origin-when-cross-origin"',
        );
      }

      if (!/\btitle=/i.test(attrs)) {
        tag = tag.replace("<iframe", '<iframe title="Background video"');
      }

      return tag;
    },
  );
}

function stripCopiedFontLinks(html: string): string {
  return html.replace(/<link\b[^>]*>/gi, (tag) => {
    const href = tag.match(/href=['"]([^'"]+)/i)?.[1] ?? "";
    if (isWordPressFontStylesheet(href)) return "";
    if (/rel=['"]preload['"]/i.test(tag) && /as=['"]font['"]/i.test(tag)) return "";
    return tag;
  });
}

export function prepareWordPressHtml(html: string, origin: string): string {
  return hydrateKadenceCountupHtml(
    hydrateKadenceTabsHtml(
      enhanceVimeoBackgroundEmbeds(
        rewriteInternalWordPressHrefs(
          absolutizeWordPressAssetUrls(stripCopiedFontLinks(html), origin),
          origin,
        ),
      ),
    ),
  );
}

export function stylesheetFetchUrl(href: string, origin: string): string {
  const base = origin.replace(/\/+$/, "");
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("/")) return `${base}${href}`;
  return href;
}

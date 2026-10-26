import { writeFile } from "node:fs/promises";

const ORIGIN = "https://www.kosick.com";
const EXTRA_PATHS = [
  "/thanks/",
  "/comfortmaker/",
  "/uncorked/",
  "/mexico-2026-welcome-itinerary/",
];

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function decodeText(html) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function metaContent(head, name) {
  const tags = head.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const key = tag.match(/\b(?:name|property)\s*=\s*(["'])([\s\S]*?)\1/i)?.[2]?.toLowerCase() || "";
    if (key !== name.toLowerCase()) continue;
    return decodeText(tag.match(/\bcontent\s*=\s*(["'])([\s\S]*?)\1/i)?.[2] || "");
  }
  return "";
}

function linkHref(head, rel) {
  const tags = head.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const key = tag.match(/\brel\s*=\s*(["'])([\s\S]*?)\1/i)?.[2]?.toLowerCase() || "";
    if (!key.split(/\s+/).includes(rel)) continue;
    return decodeText(tag.match(/\bhref\s*=\s*(["'])([\s\S]*?)\1/i)?.[2] || "");
  }
  return "";
}

function canonicalPath(pathname) {
  if (!pathname || pathname === "/") return "/";
  if (pathname.endsWith("/")) return pathname;
  if (/\.[a-z0-9]+$/i.test(pathname)) return pathname;
  return `${pathname}/`;
}

function jsonLdBlocks(html) {
  const blocks = [];
  const seen = new Set();
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    const raw = match[1]?.trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const key = JSON.stringify(parsed);
      if (seen.has(key)) continue;
      seen.add(key);
      blocks.push(parsed);
    } catch {
      // Skip malformed blocks. Rank Math's valid graphs are JSON.
    }
  }
  return blocks;
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { Accept: "text/html,application/xml;q=0.9,*/*;q=0.8" },
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return { finalUrl: response.url, text: await response.text() };
}

function isPageUrl(url) {
  const parsed = new URL(url);
  if (parsed.origin !== ORIGIN) return false;
  const path = parsed.pathname.toLowerCase();
  if (path.endsWith(".kml") || path.endsWith(".xml")) return false;
  if (path.startsWith("/wp-admin") || path.startsWith("/wp-json")) return false;
  return true;
}

async function sitemapUrls() {
  const index = await fetchText(`${ORIGIN}/sitemap_index.xml`);
  const sitemapLocs = [...index.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => decodeXml(match[1] || ""))
    .filter((url) => url.endsWith(".xml"));
  const pages = new Set();
  for (const sitemapUrl of sitemapLocs) {
    const xml = await fetchText(sitemapUrl);
    for (const match of xml.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)) {
      const url = decodeXml(match[1] || "");
      if (isPageUrl(url)) pages.add(url);
    }
  }
  return [...pages].sort();
}

async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: limit }, () => run()));
  return results;
}

const sitemapPageUrls = await sitemapUrls();
const uniqueUrls = [...new Set([
  ...sitemapPageUrls,
  ...EXTRA_PATHS.map((path) => `${ORIGIN}${path}`),
])];

const pages = {};
const failures = [];

await mapPool(uniqueUrls, 2, async (url) => {
  const headResponse = await fetch(url, {
    redirect: "manual",
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(25_000),
  });
  if (headResponse.status >= 300 && headResponse.status < 400) {
    failures.push(`${url} redirects ${headResponse.status} ${headResponse.headers.get("location") || ""}`);
    return;
  }
  const html = await headResponse.text();
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
  const title = decodeText(head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const path = canonicalPath(new URL(url).pathname);
  if (!title) {
    failures.push(`${url} missing title`);
    return;
  }
  const description = metaContent(head, "description");
  const canonical = linkHref(head, "canonical") || `${ORIGIN}${path === "/" ? "/" : path}`;
  const robots = metaContent(head, "robots");
  pages[path] = {
    title,
    description,
    canonical,
    index: !/\bnoindex\b/i.test(robots),
    follow: !/\bnofollow\b/i.test(robots),
    ogTitle: metaContent(head, "og:title") || title,
    ogDescription: metaContent(head, "og:description") || description,
    ogImage: metaContent(head, "og:image"),
    jsonLd: jsonLdBlocks(html),
  };
});

const snapshot = {
  capturedAt: new Date().toISOString(),
  source: ORIGIN,
  urls: sitemapPageUrls,
  pages,
};

await writeFile(
    new URL("../src/lib/seo/rank-math-snapshot.json", import.meta.url),
  JSON.stringify(snapshot),
);

const contact = await fetch("https://staging.kosick.com/wp-json/wp/v2/pages?slug=contact&_fields=content", {
  signal: AbortSignal.timeout(20_000),
});
const contactJson = await contact.text();
const emails = [...contactJson.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map((match) => match[0]);
console.log(JSON.stringify({
  pages: Object.keys(pages).length,
  sitemapUrls: snapshot.urls.length,
  jsonLdPages: Object.values(pages).filter((page) => page.jsonLd.length > 0).length,
  failures,
  contactStatus: contact.status,
  contactEmails: [...new Set(emails)].slice(0, 30),
}, null, 2));

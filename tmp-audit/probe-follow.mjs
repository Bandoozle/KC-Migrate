import fs from "node:fs";

const urls = JSON.parse(fs.readFileSync(new URL("./wp-urls.json", import.meta.url), "utf8"));
const preview = "https://kc-migrate.vercel.app";

function meta(html) {
  const pick = (re) => html.match(re)?.[1]?.replace(/&amp;/g, "&").replace(/&#039;/g, "'") || "";
  return {
    title: pick(/<title>([^<]*)<\/title>/i).slice(0, 160),
    description: (
      pick(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
      pick(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)
    ).slice(0, 220),
    canonical: pick(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
    ogTitle: pick(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["']/i),
    ogImage: pick(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i),
    robots: pick(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i),
    jsonLd: (html.match(/application\/ld\+json/g) || []).length,
    gtm: html.includes("GTM-K4QK6SP"),
    ga4: html.includes("G-XPYR1CEF3E"),
    h1: (html.match(/<h1\b/gi) || []).length,
    staging: (html.match(/staging\.kosick\.com/g) || []).length,
    bytes: html.length,
  };
}

async function get(url) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 50000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "KosickPrelaunchAudit/1.0" },
    });
    const type = response.headers.get("content-type") || "";
    const html = type.includes("text") || type.includes("xml") || type.includes("html")
      ? await response.text()
      : "";
    return {
      status: response.status,
      final: response.url,
      ms: Date.now() - started,
      type: type.slice(0, 60),
      ...(html ? meta(html) : { bytes: 0 }),
    };
  } catch (error) {
    return { status: "error", ms: Date.now() - started, error: String(error.message || error) };
  } finally {
    clearTimeout(timer);
  }
}

const paths = [
  ...urls.map((item) => new URL(item.loc).pathname),
  "/robots.txt",
  "/sitemap.xml",
  "/thanks",
  "/comfortmaker",
  "/uncorked",
  "/mexico-2026-welcome-itinerary",
];

const results = [];
let index = 0;
async function worker() {
  while (index < paths.length) {
    const path = paths[index];
    index += 1;
    const row = { path, ...(await get(new URL(path, preview))) };
    results.push(row);
    console.log(row.status, row.ms, path, row.title || row.error || "");
  }
}
await Promise.all(Array.from({ length: 3 }, () => worker()));
fs.writeFileSync(new URL("./preview-follow.json", import.meta.url), JSON.stringify(results, null, 2));

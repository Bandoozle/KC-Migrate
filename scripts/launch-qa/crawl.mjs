// Crawl the local production server as www.kosick.com; report status, metadata and links.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const BASE = "http://localhost:3107";
const HOST = "www.kosick.com";
const OUT = process.env.QA_OUT || path.join(os.tmpdir(), "kosick-launch-qa");
fs.mkdirSync(OUT, { recursive: true });
const outFile = process.argv[2] || path.join(OUT, "crawl.json");

async function get(path, method = "GET") {
  const res = await fetch(BASE + path, { method, redirect: "manual", headers: { host: HOST, "x-forwarded-host": HOST } });
  const body = method === "GET" ? await res.text() : "";
  return { status: res.status, location: res.headers.get("location"), body, type: res.headers.get("content-type") };
}

const report = { robots: null, sitemap: [], pages: {}, links: {}, external: {}, special: [] };
report.robots = (await get("/robots.txt")).body;
const sm = await get("/sitemap.xml");
report.sitemapStatus = sm.status;
report.sitemap = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
report.sitemapIndex = (await get("/sitemap_index.xml")).body;

const queue = new Set(report.sitemap.map((u) => new URL(u).pathname));
["/", "/services/", "/site-map/", "/contact/", "/online-payments/", "/privacy-policy/", "/terms-of-service/", "/terms-and-conditions/", "/cookie-policy/", "/this-page-does-not-exist-qa/"].forEach((p) => queue.add(p));
// WordPress-only paths that must never render (404) or must redirect: archives, attachments, feeds, wp-* files, retired microsites
["/thanks/", "/comfortmaker/", "/uncorked/", "/mexico-2026-welcome-itinerary/", "/blog/", "/feature-articles/page/2/", "/category/latest/", "/tag/tv-advertising/", "/author/bretton/", "/search/test/", "/page/2/", "/2026/", "/feed/", "/comments/feed/", "/travel/", "/wp-login.php", "/wp-admin/", "/wp-json/", "/xmlrpc.php", "/anything/contact/"].forEach((p) => queue.add(p));
const seen = new Set();
const attr = (html, re) => (html.match(re) || [])[1] || null;

while (queue.size) {
  const path = queue.values().next().value;
  queue.delete(path);
  if (seen.has(path)) continue;
  seen.add(path);
  let r;
  try { r = await get(path); } catch (e) { report.pages[path] = { error: String(e) }; continue; }
  const h = r.body;
  const head = h.slice(0, h.indexOf("</head>") + 7);
  report.pages[path] = {
    status: r.status,
    location: r.location,
    title: attr(head, /<title>([^<]*)<\/title>/),
    description: attr(head, /<meta name="description" content="([^"]*)"/),
    canonical: attr(head, /<link rel="canonical" href="([^"]*)"/),
    robots: attr(head, /<meta name="robots" content="([^"]*)"/),
    ogTitle: attr(head, /<meta property="og:title" content="([^"]*)"/),
    ogDesc: attr(head, /<meta property="og:description" content="([^"]*)"/),
    ogImage: attr(head, /<meta property="og:image" content="([^"]*)"/),
    ogUrl: attr(head, /<meta property="og:url" content="([^"]*)"/),
    twitter: attr(head, /<meta name="twitter:card" content="([^"]*)"/),
    jsonld: (h.match(/application\/ld\+json/g) || []).length,
    gsc: attr(head, /<meta name="google-site-verification" content="([^"]*)"/),
    staging: (h.match(/staging\.kosick\.com/g) || []).length,
    vercel: (h.match(/[a-z0-9-]+\.vercel\.app/g) || []),
    localhost: (h.match(/localhost|127\.0\.0\.1/g) || []).length,
    httpSrc: [...new Set([...h.matchAll(/(?:src|href|srcset|content)="(http:\/\/[^"\s]+)/g)].map((m) => m[1]))],
  };
  if (r.status !== 200) continue;
  for (const m of h.matchAll(/<a\b[^>]*?href="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    const rec = (report.links[href] ||= new Set());
    rec.add(path);
    if (!href || href === "#" || href.startsWith("javascript:")) continue;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    let url;
    try { url = new URL(href, `https://${HOST}${path}`); } catch { report.special.push({ href, path }); continue; }
    if (url.host === HOST || url.host === "kosick.com") {
      if (!url.pathname.startsWith("/wp-content") && !/\.(pdf|jpg|png|webp|kml|xml)$/i.test(url.pathname)) queue.add(url.pathname);
    } else {
      (report.external[url.origin + url.pathname] ||= new Set()).add(path);
    }
  }
}
for (const k of Object.keys(report.links)) report.links[k] = [...report.links[k]];
for (const k of Object.keys(report.external)) report.external[k] = [...report.external[k]];
fs.writeFileSync(outFile, JSON.stringify(report, null, 1));
console.log("pages", seen.size, "sitemap", report.sitemap.length);

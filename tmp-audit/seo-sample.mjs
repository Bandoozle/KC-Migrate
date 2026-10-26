const pages = [
  "/",
  "/contact/",
  "/services/",
  "/services/hvac-marketing/",
  "/marketing-programs/",
  "/feature-articles/",
  "/hvac-marketing-strategies/",
  "/digital-marketing-vs-traditional-advertising/",
];

function meta(html) {
  const pick = (re) =>
    (html.match(re)?.[1] || "")
      .replace(/&amp;/g, "&")
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"');
  return {
    title: pick(/<title>([^<]*)<\/title>/i),
    description: pick(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
      pick(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i),
    canonical: pick(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
    robots: pick(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i),
    ogTitle: pick(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["']/i),
    ogDesc: pick(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']*)["']/i),
    ogImage: pick(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i),
    jsonLdTypes: [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]).slice(0, 12),
    h1: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()).slice(0, 3),
  };
}

async function grab(origin, path) {
  const response = await fetch(new URL(path, origin), { redirect: "follow" });
  const html = await response.text();
  return { status: response.status, final: response.url, ...meta(html) };
}

const rows = [];
for (const path of pages) {
  const wp = await grab("https://www.kosick.com", path);
  const next = await grab("https://kc-migrate.vercel.app", path);
  rows.push({ path, wp, next });
  console.log("\n==", path);
  console.log("WP", wp.status, wp.title);
  console.log("NX", next.status, next.title);
  console.log("WP canon", wp.canonical);
  console.log("NX canon", next.canonical);
  console.log("WP desc", wp.description.slice(0, 140));
  console.log("NX desc", next.description.slice(0, 140));
  console.log("WP h1", wp.h1.join(" | "));
  console.log("NX h1", next.h1.join(" | "));
  console.log("WP ld", wp.jsonLdTypes.join(","));
  console.log("NX ld", next.jsonLdTypes.join(","));
}

import fs from "node:fs";
fs.writeFileSync(new URL("./seo-sample.json", import.meta.url), JSON.stringify(rows, null, 2));

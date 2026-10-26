import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const base = "http://127.0.0.1:3010";

function curl(args) {
  return execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 20_000_000 });
}

const robotsWww = curl(["-s", "-H", "Host: www.kosick.com", `${base}/robots.txt`]);
const robotsPreview = curl(["-s", "-H", "Host: kc-migrate.vercel.app", `${base}/robots.txt`]);
const homeWww = curl(["-s", "-H", "Host: www.kosick.com", `${base}/`]);
const homePreview = curl(["-s", "-H", "Host: kc-migrate.vercel.app", `${base}/`]);
writeFileSync("tmp-audit/stab-home-www.html", homeWww);
writeFileSync("tmp-audit/stab-home-preview.html", homePreview);

const dead = [
  "cityscape-of-capital-of-corfu-island",
  "smartmockups_ljx6qkvg",
  "Screen-Recording-2024-03-14",
];
const pages = {
  "/corporate-events/": ["resort-marketing.mp4"],
  "/services/outdoor-advertising/": ["digital-superboard", "billboard-2"],
  "/services/website-development/": ["screen-recording-2024-03-14-at-9.30.00-am-1.mp4"],
};
const media = {};
for (const [path, expected] of Object.entries(pages)) {
  const html = await (await fetch(`${base}${path}`)).text();
  media[path] = {
    status: 200,
    dead: dead.filter((name) => html.toLowerCase().includes(name.toLowerCase())),
    expected: Object.fromEntries(expected.map((name) => [name, html.toLowerCase().includes(name.toLowerCase())])),
    jsonLd: (html.match(/application\/ld\+json/g) || []).length,
    title: html.match(/<title>([^<]*)<\/title>/)?.[1] || "",
  };
}

const homeTitle = homeWww.match(/<title>([^<]*)<\/title>/)?.[1] || "";
const contactAndMissing = await Promise.all([
  fetch(`${base}/contact/`),
  fetch(`${base}/this-page-is-not-published-xyz/`),
]);

const empty = new FormData();
empty.set("formKey", "contact");
const emptyResponse = await fetch(`${base}/api/contact-form/`, { method: "POST", body: empty });
const emptyBody = await emptyResponse.json();

const honeypot = new FormData();
honeypot.set("formKey", "contact");
honeypot.set("field652327-6b", "Audit Probe");
honeypot.set("field4d218f-d3", "probe@example.com");
honeypot.set("field7ef1b0-96", "6045550100");
honeypot.set("_kosick_hp", "bot");
const honeypotResponse = await fetch(`${base}/api/contact-form/`, { method: "POST", body: honeypot });
const honeypotBody = await honeypotResponse.json();

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const locs = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1]);

async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: limit }, () => run()));
  return results;
}

const crawl = await mapPool(locs, 2, async (url) => {
  const path = new URL(url).pathname;
  const started = Date.now();
  try {
    const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(40_000) });
    return { path, status: response.status, ms: Date.now() - started };
  } catch (error) {
    return { path, status: "error", ms: Date.now() - started, message: error instanceof Error ? error.message : "error" };
  }
});

const counts = {};
for (const row of crawl) counts[row.status] = (counts[row.status] || 0) + 1;
const problems = crawl.filter((row) => row.status !== 200);

const kml = await fetch(`${base}/locations.kml`);
const kmlBody = await kml.text();

console.log(JSON.stringify({
  robotsWww,
  robotsPreview,
  gtmWww: homeWww.includes("googletagmanager.com/gtm.js"),
  gtmPreview: homePreview.includes("googletagmanager.com/gtm.js"),
  homeTitle,
  homeJsonLd: (homeWww.match(/application\/ld\+json/g) || []).length,
  contactStatus: contactAndMissing[0].status,
  missingStatus: contactAndMissing[1].status,
  emptyForm: { status: emptyResponse.status, error: emptyBody.error },
  honeypot: { status: honeypotResponse.status, error: honeypotBody.error },
  sitemapCount: locs.length,
  crawl: counts,
  problems,
  kml: { status: kml.status, type: kml.headers.get("content-type"), hasKml: kmlBody.includes("<kml") },
  media,
}, null, 2));

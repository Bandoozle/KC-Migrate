const base = process.env.BASE ?? "http://localhost:3000";
const pages = [
  "/",
  "/services/",
  "/services/television-advertising/",
  "/services/radio-advertising/",
  "/services/outdoor-advertising/",
  "/services/digital-marketing/",
  "/services/digital-connected-tv/",
  "/services/social-media-marketing/",
  "/services/search-engine-optimization/",
  "/services/email-marketing/",
  "/services/corporate-branding/",
  "/services/creative/",
  "/services/business-development/",
  "/services/website-development/",
  "/services/hvac-marketing/",
  "/services/golf-marketing/",
  "/services/dental-marketing/",
  "/services/medical-aesthetics-marketing/",
  "/services/travel-marketing/",
  "/services/retail-marketing/",
  "/services/residential-construction-marketing/",
  "/marketing-programs/",
  "/marketing-results/",
  "/feature-articles/",
  "/corporate-events/",
  "/contact/",
];

const uses = new Map();
const missing = [];

function normalize(raw) {
  const value = raw.replace(/&amp;/g, "&");
  if (value.startsWith("/_next/image")) {
    const url = new URL(value, base).searchParams.get("url");
    return url ? decodeURIComponent(url) : null;
  }
  return value;
}

for (const page of pages) {
  const response = await fetch(base + page, { redirect: "follow" });
  if (!response.ok) {
    missing.push(`${response.status} ${page}`);
    continue;
  }
  const html = (await response.text()).replace(/<script[\s\S]*?<\/script>/g, "");
  const found = new Set();
  for (const match of html.matchAll(/<img[^>]*?\ssrc="([^"]+)"/g)) {
    const src = normalize(match[1]);
    if (src && !/\.svg($|\?)|logo/i.test(src)) found.add(src);
  }
  for (const src of found) {
    const list = uses.get(src) ?? [];
    list.push(page);
    uses.set(src, list);
  }
}

console.log(missing.length ? `Not OK: ${missing.join(", ")}` : "All pages 200");
[...uses.entries()]
  .filter(([, list]) => list.length > 1)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([src, list]) => console.log(`${list.length}\t${src}\n\t${list.join("  ")}`));

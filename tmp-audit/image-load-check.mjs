const base = process.env.BASE ?? "http://localhost:3000";
const pages = [
  "/", "/services/", "/services/television-advertising/", "/services/radio-advertising/",
  "/services/outdoor-advertising/", "/services/digital-marketing/", "/services/digital-connected-tv/",
  "/services/social-media-marketing/", "/services/search-engine-optimization/", "/services/email-marketing/",
  "/services/corporate-branding/", "/services/creative/", "/services/business-development/",
  "/services/website-development/", "/services/hvac-marketing/", "/services/golf-marketing/",
  "/services/dental-marketing/", "/services/medical-aesthetics-marketing/", "/services/travel-marketing/",
  "/services/retail-marketing/", "/services/specialty-retail-marketing/", "/services/construction-marketing/",
  "/marketing-programs/", "/marketing-results/", "/feature-articles/", "/corporate-events/", "/contact/",
];

const checked = new Map();
const failures = [];
for (const page of pages) {
  const response = await fetch(base + page);
  if (!response.ok) {
    failures.push(`page ${response.status} ${page}`);
    continue;
  }
  const html = (await response.text()).replace(/<script[\s\S]*?<\/script>/g, "");
  for (const [, raw] of html.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)) {
    const src = raw.replace(/&amp;/g, "&");
    if (!checked.has(src)) {
      const result = await fetch(new URL(src, base));
      checked.set(src, result.status);
      if (!result.ok) failures.push(`img ${result.status} ${src} (on ${page})`);
    }
  }
}
console.log(`${pages.length} pages, ${checked.size} unique images checked`);
console.log(failures.length ? failures.join("\n") : "No failures");

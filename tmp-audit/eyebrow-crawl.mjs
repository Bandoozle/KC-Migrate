import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const res = await fetch("http://localhost:3001/sitemap.xml");
const xml = await res.text();
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const extra = ["/thanks/", "/comfortmaker/", "/mexico-itinerary/"];
const only = process.argv[2] ? process.argv[2].split(",") : null;
const list = only || [...paths, ...extra];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const out = [];

for (const path of list) {
  try {
    const r = await page.goto(`http://localhost:3001${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    if (!r || r.status() >= 400) {
      out.push({ path, status: r?.status() });
      continue;
    }
    await page.waitForTimeout(400);
    const found = await page.evaluate(() => {
      const skip = (el) => el.closest("header, footer, nav, #masthead, #colophon, button, a.solid, [class*=button], [class*=Button], .kb-button, .wp-block-button");
      const results = [];
      for (const el of document.querySelectorAll("body *")) {
        if (skip(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.textTransform !== "uppercase") continue;
        if (el.parentElement && getComputedStyle(el.parentElement).textTransform === "uppercase") continue;
        const text = el.textContent.trim().replace(/\s+/g, " ");
        if (!text || text.length > 80) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        let next = el.nextElementSibling;
        while (next && !/^H[1-6]$/.test(next.tagName) && !next.querySelector?.("h1,h2,h3,h4")) next = next.nextElementSibling;
        const heading = next ? (/^H/.test(next.tagName) ? next : next.querySelector("h1,h2,h3,h4")) : null;
        results.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.baseVal ?? el.className ?? "").toString().slice(0, 80),
          text,
          heading: heading ? `${heading.tagName}: ${heading.textContent.trim().replace(/\s+/g, " ").slice(0, 70)}` : "-",
        });
      }
      return results;
    });
    out.push({ path, found });
  } catch (e) {
    out.push({ path, error: String(e).slice(0, 120) });
  }
}
await browser.close();
writeFileSync("tmp-audit/eyebrow-crawl.json", JSON.stringify(out, null, 1));
for (const p of out) {
  if (p.status || p.error) {
    console.log(`\n# ${p.path} ${p.status || p.error}`);
    continue;
  }
  if (!p.found.length) continue;
  console.log(`\n# ${p.path}`);
  for (const f of p.found) console.log(`  [${f.tag}.${f.cls.split(" ")[0]}] "${f.text}"  ->  ${f.heading}`);
}

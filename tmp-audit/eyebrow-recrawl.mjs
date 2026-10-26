import { chromium } from "playwright";

const xml = await (await fetch("http://localhost:3001/sitemap.xml")).text();
const all = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const paths = process.argv[2] ? process.argv[2].split(",") : [...all, "/thanks/"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
let upperCount = 0;
for (const path of paths) {
  const r = await page.goto(`http://localhost:3001${path}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  if (!r || r.status() >= 400) {
    console.log(`# ${path} STATUS ${r?.status()}`);
    continue;
  }
  await page.waitForTimeout(300);
  const data = await page.evaluate(() => {
    const rows = [];
    const sel = '[class*="eyebrow"], [class*="Eyebrow"], [class*="kicker"], [class*="Kicker"], [class*="label"], [class*="Label"]';
    for (const el of document.querySelectorAll(sel)) {
      if (el.closest("header, footer, nav, #masthead, #colophon, button, [role=tab], form")) continue;
      const text = el.textContent.trim().replace(/\s+/g, " ");
      if (!text || text.length > 70) continue;
      const cs = getComputedStyle(el);
      if (!/eyebrow|kicker|Kicker|Eyebrow/.test(el.className.toString()) && cs.textTransform !== "uppercase") continue;
      rows.push(`${cs.textTransform === "uppercase" ? "UPPER " : ""}"${text}" ls=${cs.letterSpacing}`);
    }
    const upper = [...document.querySelectorAll("main *")].filter((el) => {
      if (el.closest("button, a, [role=tab]")) return false;
      const t = getComputedStyle(el).textTransform === "uppercase";
      const p = el.parentElement && getComputedStyle(el.parentElement).textTransform === "uppercase";
      return t && !p && el.textContent.trim() && el.tagName !== "H1";
    }).map((el) => `UPPER-OTHER <${el.tagName.toLowerCase()}> "${el.textContent.trim().slice(0, 50)}"`);
    return [...rows, ...upper];
  });
  upperCount += data.filter((d) => d.includes("UPPER")).length;
  if (data.length) console.log(`# ${path}\n  ${data.join("\n  ")}`);
}
console.log(`\nuppercase label count: ${upperCount}`);
await browser.close();

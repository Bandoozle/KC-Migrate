import { chromium } from "playwright";

const path = process.argv[2] || "/services/outdoor-advertising/";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://localhost:3001${path}`, { waitUntil: "networkidle", timeout: 120000 });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
});
await page.waitForTimeout(800);
const info = await page.evaluate(() => ({
  imgs: [...document.querySelectorAll("main img, main video, main source")].map((el) => {
    const src = el.currentSrc || el.src || el.getAttribute("src") || "";
    let real = src;
    try { real = new URL(src).searchParams.get("url") || src; } catch {}
    return `${el.tagName} ${el.naturalWidth || ""}x${el.naturalHeight || ""} ${real} | ${el.alt || ""}`;
  }),
  text: [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main a, main button")].map((el) => `${el.tagName}: ${el.textContent.replace(/\s+/g, " ").trim().slice(0, 140)}`),
  links: [...new Set([...document.querySelectorAll("main a[href]")].map((a) => a.getAttribute("href")))],
  jsonld: [...document.querySelectorAll("script[type='application/ld+json']")].map((s) => s.textContent.slice(0, 120)),
  canonical: document.querySelector("link[rel=canonical]")?.href,
  title: document.title,
}));
console.log(JSON.stringify(info, null, 1));
await browser.close();

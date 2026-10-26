import { chromium } from "playwright";
const pages = [
  ["dv", "/services/digital-connected-tv/"],
  ["cb", "/services/corporate-branding/"],
  ["radio", "/services/radio-advertising/"],
];
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 390]) {
  for (const [tag, path] of pages) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(2000);
    const hero = page.locator("main > section").first();
    await hero.screenshot({ path: `tmp-audit/shots/hero-${tag}-${width}.png` });
    const info = await page.evaluate(() => ({
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.replace(/\s+/g, " ").trim()),
      heroClass: document.querySelector("main > section")?.className.slice(0, 40),
      slides: document.querySelectorAll("main > section:first-child img, main > section:first-child video").length,
      overflow: document.documentElement.scrollWidth - innerWidth,
    }));
    console.log(width, tag, JSON.stringify(info), "errors", errors.length);
    await page.close();
  }
}
await browser.close();

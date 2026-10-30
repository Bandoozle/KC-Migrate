import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/services/hvac-marketing/hvac-lead-generation/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => {
    const h2 = [...document.querySelectorAll("main h2")].map((h) => h.textContent.replace(/\s+/g, " ").trim());
    const imgs = [...document.querySelectorAll("main img")].filter((img) => img.getBoundingClientRect().height < 8).map((img) => img.alt.slice(0, 30));
    return {
      h1: document.querySelector("h1")?.textContent.replace(/\s+/g, " ").trim(),
      h2,
      hero: document.querySelector("main > *")?.className?.toString().includes("HeroBanner") || document.querySelector("[class*=HeroBanner]") != null,
      logos: document.querySelectorAll("ul img").length,
      dead: imgs,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  console.log(width, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

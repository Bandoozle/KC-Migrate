import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const failed = [];
  page.on("response", (res) => {
    if (res.status() >= 400 && /hvac|wp-content|lead-generation/i.test(res.url())) failed.push(res.status() + " " + res.url().slice(-80));
  });
  await page.goto("http://localhost:3000/services/hvac-marketing/hvac-lead-generation/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const h1 = [...document.querySelectorAll("h1")].map((h) => h.textContent.replace(/\s+/g, " ").trim());
    const h2 = [...document.querySelectorAll("main h2")].map((h) => h.textContent.replace(/\s+/g, " ").trim());
    const hero = document.querySelector("main > section, main > div");
    const imgs = [...document.querySelectorAll("main img")].map((img) => ({
      alt: img.alt.slice(0, 40),
      h: Math.round(img.getBoundingClientRect().height),
    }));
    return {
      h1,
      h2,
      heroClass: hero?.className?.toString().slice(0, 40),
      imgs,
      logos: document.querySelectorAll("ul img").length,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  console.log(width, JSON.stringify(info), "errors", errors, "failed", failed.slice(0, 5));
  await page.close();
}
await browser.close();

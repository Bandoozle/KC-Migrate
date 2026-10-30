import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/services/digital-connected-tv/", { waitUntil: "load", timeout: 90000 });
  const section = page.locator("#dv-formats").locator("xpath=ancestor::section[1]");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const grid = section.locator("article").first().locator("xpath=..");
  await grid.screenshot({ path: `tmp-audit/shots/dv-formats-${width}.png` });
  const info = await page.evaluate(() => {
    const cards = [...document.querySelectorAll("#dv-formats")].length
      ? [...document.querySelector("#dv-formats").closest("section").querySelectorAll("article")]
      : [];
    const boxes = cards.map((card) => {
      const r = card.getBoundingClientRect();
      const img = card.querySelector("img")?.getBoundingClientRect();
      const title = card.querySelector("h3")?.getBoundingClientRect();
      return {
        h: Math.round(r.height),
        imgTopGap: img && title ? Math.round(title.top - img.bottom) : null,
        top: Math.round(r.top),
      };
    });
    return { cards: boxes, overflow: document.documentElement.scrollWidth - innerWidth };
  });
  console.log(width, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

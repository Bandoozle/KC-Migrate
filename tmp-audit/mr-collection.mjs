import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const [tag, width] of [["d", 1440], ["t", 900], ["m", 390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/marketing-results/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1200);
  const section = page.locator("section[aria-labelledby='collection-heading']");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await section.screenshot({ path: `tmp-audit/shots/mr-collection-${tag}.png` });
  const info = await page.evaluate(() => {
    const s = document.querySelector("section[aria-labelledby='collection-heading']");
    const title = s.querySelector("h2").getBoundingClientRect();
    const filters = s.querySelector("[role=toolbar]").getBoundingClientRect();
    const more = s.querySelector("button[class*='more']")?.getBoundingClientRect();
    const rail = s.querySelector("h2").closest("[class*='rail']").getBoundingClientRect();
    const copies = [...s.querySelectorAll("[class*='tileCopy']")].map((c) => Math.round(c.getBoundingClientRect().height));
    return {
      titleLeft: Math.round(title.left),
      filtersLeft: Math.round(filters.left),
      moreCenterOffset: more ? Math.round(more.left + more.width / 2 - (rail.left + rail.width / 2)) : null,
      copyHeights: copies,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  console.log(tag, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/services/digital-connected-tv/", { waitUntil: "load", timeout: 90000 });
  const cards = page.locator("ul").filter({ hasText: "How much of the spot viewers watch" });
  await cards.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await cards.screenshot({ path: `tmp-audit/shots/dv-cards-${width}.png` });
  const info = await cards.evaluate((el) => {
    const item = el.querySelector("li");
    const style = getComputedStyle(item);
    return {
      count: el.querySelectorAll("li").length,
      radius: style.borderRadius,
      bg: style.backgroundColor,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  console.log(width, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

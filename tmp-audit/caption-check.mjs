import { chromium } from "playwright";

const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const cap = page.locator("#tv-reel-caption");
  await cap.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const data = await cap.evaluate((el) => {
    const c = el.getBoundingClientRect();
    const f = el.closest("figure").getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(el);
    const t = range.getBoundingClientRect();
    return { leftGap: Math.round(t.left - f.left), rightGap: Math.round(f.right - t.right), align: getComputedStyle(el).textAlign, w: Math.round(c.width) };
  });
  console.log(width, JSON.stringify(data));
  const box = await cap.boundingBox();
  await page.screenshot({ path: `tmp-audit/caption-${width}.png`, clip: { x: 0, y: Math.max(0, box.y - 120), width, height: 220 } });
  await page.close();
}
await browser.close();

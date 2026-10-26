import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const [name, width, height] of [["d", 1440, 900], ["t", 768, 1024], ["m", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000/services/radio-advertising/", { waitUntil: "networkidle" });
  const list = page.locator("ul[class*='points']").filter({ hasText: "Precision" }).first();
  const panel = page.getByRole("tabpanel").filter({ has: list });
  await page.getByRole("tab", { name: /streaming/i }).first().click();
  await page.waitForTimeout(500);
  await list.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const boxes = await list.locator("li").evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.width), Math.round(r.height)]; }));
  console.log(name, "visible", await list.isVisible(), JSON.stringify(boxes), "overflow", await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await panel.screenshot({ path: `tmp-audit/shots/radio-points-${name}.png` });
  await page.close();
}
await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
const panel = page.locator(".localPanel, [class*='localPanel']").first();
await panel.waitFor();
const box = await panel.boundingBox();
console.log("panel", box && { w: Math.round(box.width), h: Math.round(box.height), y: Math.round(box.y) });
if (box) {
  await panel.scrollIntoViewIfNeeded();
  const next = await panel.boundingBox();
  if (next) {
    await page.screenshot({
      path: "tmp-audit/seo-local/panel-390.png",
      clip: { x: 0, y: Math.max(0, next.y - 8), width: 390, height: Math.min(900, next.height + 16) },
    });
  }
}
const wide = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await wide.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
await wide.locator("#seo-market-1").scrollIntoViewIfNeeded();
await wide.waitForTimeout(1500);
const info = await wide.evaluate(() => {
  const el = document.getElementById("seo-market-1");
  el.click();
  return {
    names: Object.getOwnPropertyNames(el).slice(0, 12),
    selected: el.getAttribute("aria-selected"),
    text: document.getElementById("seo-market-panel").innerText.replace(/\s+/g, " ").slice(0, 80),
  };
});
console.log(JSON.stringify(info));
await browser.close();

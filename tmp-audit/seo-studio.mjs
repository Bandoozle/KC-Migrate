import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
await page.locator("h1").waitFor();
await page.waitForTimeout(500);
await page.screenshot({ path: "tmp-audit/seo-review/studio-1440.png", clip: { x: 0, y: 560, width: 1440, height: 340 } });
const stage = page.locator("h2", { hasText: "Search engine optimization (SEO)" });
await stage.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.screenshot({ path: "tmp-audit/seo-review/stage-1440.png" });
await browser.close();

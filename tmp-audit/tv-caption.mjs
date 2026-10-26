import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("h1").waitFor({ timeout: 20000 });
const caption = page.locator("figure[class*='screen'] figcaption");
await caption.scrollIntoViewIfNeeded();
const size = await caption.evaluate((node) => getComputedStyle(node).fontSize);
console.log("caption", size, (await caption.innerText()));
const box = await caption.boundingBox();
await page.screenshot({
  path: "tmp-audit/tv-refine/caption-1440.png",
  clip: { x: 0, y: Math.max(0, (box?.y || 0) - 40), width: 1440, height: 520 },
});
await browser.close();

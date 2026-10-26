import { chromium } from "playwright";
const browser = await chromium.launch();
for (const width of [390, 768]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("h1").waitFor({ timeout: 20000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(width, "overflow", overflow);
  await page.locator("section[class*='lineup']").screenshot({ path: `tmp-audit/tv-refine/lineup-compose-${width}.png` });
  await page.close();
}
await browser.close();

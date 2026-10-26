import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/flagship";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const [name, url] of [
  ["home", "http://127.0.0.1:3001/"],
  ["seo", "http://127.0.0.1:3001/services/search-engine-optimization/"],
]) {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator("h1").waitFor({ timeout: 20000 });
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    await page.screenshot({ path: `${outDir}/${name}-${width}.png`, fullPage: true });
    console.log(name, width, overflow);
    await page.close();
  }
}
await browser.close();

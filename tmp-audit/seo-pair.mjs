import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/seo-compare";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const widths = [390, 768, 1440, 1920];

async function shoot(name, url) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(name === "live" ? 2000 : 500);
    if (name === "next") {
      await page.locator("text=What the work covers").waitFor({ timeout: 20000 });
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    await page.screenshot({ path: `${outDir}/${name}-${width}.png`, fullPage: true });
    console.log(name, width, "overflow", overflow);
    await page.close();
  }
}

await shoot("live", "https://www.kosick.com/services/search-engine-optimization/");
await shoot("next", "http://127.0.0.1:3001/services/search-engine-optimization/");
await browser.close();

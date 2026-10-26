import { chromium } from "playwright";
import fs from "fs";

fs.mkdirSync("tmp-audit/tv-refine", { recursive: true });
const browser = await chromium.launch();

for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto("http://localhost:3001/services/television-advertising/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("h1").waitFor({ timeout: 20000 });
  const metrics = await page.evaluate(() => {
    const title = document.querySelector("#tv-reach");
    const aside = title?.nextElementSibling;
    const titleBox = title.getBoundingClientRect();
    const asideBox = aside?.getBoundingClientRect();
    return {
      title: Math.round(titleBox.width),
      aside: asideBox ? Math.round(asideBox.width) : null,
      asideText: aside?.textContent?.trim(),
    };
  });
  console.log(width, metrics);
  await page.locator("section[class*='reel']").screenshot({ path: `tmp-audit/tv-refine/reel-balance-${width}.png` });
  await page.close();
}

await browser.close();

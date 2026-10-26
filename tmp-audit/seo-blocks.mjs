import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/seo-art";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForFunction(
    (expected) => {
      const img = document.querySelector("h1")?.closest("section")?.querySelector("img");
      return img && img.getBoundingClientRect().width > expected * 0.8;
    },
    width,
    { timeout: 30000 },
  );
  const sections = page.locator("article > section");
  const count = await sections.count();
  for (let i = 0; i < count; i += 1) {
    await sections.nth(i).screenshot({ path: `${outDir}/block-${width}-${i}.png` });
  }
  await page.close();
}

await browser.close();
console.log("blocks done");

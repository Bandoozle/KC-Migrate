import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("text=What the work covers").waitFor();
const sections = page.locator("article > section");
const count = await sections.count();
for (let i = 1; i < count; i += 1) {
  const box = await sections.nth(i).boundingBox();
  await sections.nth(i).screenshot({ path: `tmp-audit/seo-compare/section-1440-${i}.png` });
  console.log(i, box ? Math.round(box.height) : 0);
}
const img = page.locator("figure img");
if (await img.count()) {
  const box = await img.first().boundingBox();
  console.log("figure", box ? `${Math.round(box.width)}x${Math.round(box.height)}` : "none");
}
await browser.close();

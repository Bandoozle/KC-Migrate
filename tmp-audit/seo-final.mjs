import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("text=Competitor Analysis").waitFor();
const sections = page.locator("article > section");
const count = await sections.count();
for (let i = 0; i < count; i += 1) {
  await sections.nth(i).screenshot({ path: `tmp-audit/seo-art/final-1440-${i}.png` });
}
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await mobile.locator("text=Competitor Analysis").waitFor();
await mobile.screenshot({ path: "tmp-audit/seo-art/final-full-390.png", fullPage: true });
const overflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
console.log("mobile overflow", overflow, "sections", count);
await browser.close();

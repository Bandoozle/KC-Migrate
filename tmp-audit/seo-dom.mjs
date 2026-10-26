import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(800);
const html = await page.locator("h1").evaluate((node) => {
  const section = node.closest("section");
  return {
    h1Class: node.className,
    sectionClass: section?.className,
    sectionStart: section?.outerHTML.slice(0, 500),
  };
});
console.log(JSON.stringify(html, null, 2));
await browser.close();

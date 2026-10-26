import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3001/services/golf-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(800);
const info = await page.locator("h1").evaluate((node) => ({
  h1Class: node.className,
  sectionClass: node.closest("section")?.className,
}));
console.log(info);
await browser.close();

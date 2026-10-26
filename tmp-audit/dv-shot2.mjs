import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/digital-connected-tv/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await page.locator("[class*='groups']").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: "tmp-audit/shots/dv-partners.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/services/digital-connected-tv/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await mobile.locator("[class*='board']").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(300);
console.log("overflow", await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));
await mobile.screenshot({ path: "tmp-audit/shots/dv-mobile.png" });
await browser.close();

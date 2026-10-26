import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await page.goto("http://localhost:3000/services/digital-connected-tv/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
const meta = await page.evaluate(() => ({
  h1: [...document.querySelectorAll("h1")].map((node) => node.textContent.trim()),
  h2: [...document.querySelectorAll("h2")].map((node) => node.textContent.trim()),
  overflow: document.documentElement.scrollWidth - window.innerWidth,
}));
console.log(JSON.stringify(meta, null, 2));
console.log("errors", errors);
await page.screenshot({ path: "tmp-audit/shots/dv-hero.png" });
await page.locator("[class*='formatGrid']").scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({ path: "tmp-audit/shots/dv-formats.png" });
await page.locator("[class*='groups']").scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({ path: "tmp-audit/shots/dv-partners.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/services/digital-connected-tv/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await mobile.locator("[class*='board']").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(200);
const mobileMeta = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await mobile.screenshot({ path: "tmp-audit/shots/dv-mobile.png" });
console.log("mobile overflow", mobileMeta);
await browser.close();

import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await context.newPage();
await page.goto("http://localhost:3000/services/creative/", { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(2500);
const out = await page.evaluate(() => ({
  heroPaused: document.querySelector("section[aria-labelledby='cp-hero'] video").paused,
  toggle: document.querySelector("section[aria-labelledby='cp-hero'] button").getAttribute("aria-label"),
}));
console.log(JSON.stringify(out));
await browser.close();

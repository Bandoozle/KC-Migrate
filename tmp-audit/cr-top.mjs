import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/services/creative/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(2000);
  await page.locator("main > section").nth(0).screenshot({ path: `tmp-audit/shots/cr-top-hero-${width}.png` });
  const sel = page.locator("main > section").nth(1);
  await sel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await sel.screenshot({ path: `tmp-audit/shots/cr-top-tabs-${width}.png` });
  const info = await page.evaluate(() => ({
    h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.replace(/\s+/g, " ").trim()),
    heroClass: document.querySelector("main > section").className.slice(0, 30),
    tabSize: getComputedStyle(document.querySelector("[role=tab] span:last-child")).fontSize,
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  console.log(width, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

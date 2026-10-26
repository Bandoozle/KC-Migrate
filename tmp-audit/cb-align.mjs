import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/corporate-branding/", { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(1500);
await page.addStyleTag({ content: "header, nextjs-portal { visibility: hidden !important; }" });
const section = page.locator("main > section").nth(1);
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const m = await page.evaluate(() => {
  const copy = document.querySelector("[class*='introGrid']").children[0].getBoundingClientRect();
  const visual = document.querySelector("[class*='introGrid']").children[1].getBoundingClientRect();
  const mid = (r) => Math.round(r.top + r.height / 2);
  return { copyMid: mid(copy), visualMid: mid(visual), copyTop: Math.round(copy.top), visualTop: Math.round(visual.top) };
});
console.log(JSON.stringify(m));
await section.screenshot({ path: "tmp-audit/shots/cb-align.png" });
await browser.close();


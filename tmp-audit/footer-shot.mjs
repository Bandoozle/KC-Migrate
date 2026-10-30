import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/services/creative/", { waitUntil: "load", timeout: 90000 });
  const footer = page.locator("footer[role=contentinfo]");
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await footer.screenshot({ path: `tmp-audit/shots/footer-${width}.png` });
  const info = await page.evaluate(() => ({
    links: [...document.querySelectorAll("footer[role=contentinfo] a")].length,
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  console.log(width, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

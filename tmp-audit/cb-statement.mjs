import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const [tag, width] of [["d", 1440], ["m", 390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3000/services/corporate-branding/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1200);
  const section = page.locator("section[aria-labelledby='cb-rebrands']");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await section.screenshot({ path: `tmp-audit/shots/cb-statement-${tag}.png` });
  const info = await page.evaluate(() => {
    const s = document.querySelector("section[aria-labelledby='cb-rebrands']");
    const cs = getComputedStyle(s);
    return { overflow: document.documentElement.scrollWidth > innerWidth, pad: [cs.paddingTop, cs.paddingBottom], h: s.getBoundingClientRect().height };
  });
  console.log(tag, JSON.stringify(info));
  await page.close();
}
await browser.close();

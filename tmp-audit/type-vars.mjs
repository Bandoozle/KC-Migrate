import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("#tv-reach").waitFor();
const info = await page.evaluate(() => {
  const node = document.querySelector("#tv-reach");
  const style = getComputedStyle(node);
  const root = getComputedStyle(document.documentElement);
  return {
    size: style.fontSize,
    leading: style.lineHeight,
    tracking: style.letterSpacing,
    varSize: root.getPropertyValue("--kosick-section-title-size"),
    varLeading: root.getPropertyValue("--kosick-section-title-leading"),
    varTracking: root.getPropertyValue("--kosick-section-title-tracking"),
    varWeight: root.getPropertyValue("--kosick-section-title-weight"),
  };
});
console.log(info);
await browser.close();

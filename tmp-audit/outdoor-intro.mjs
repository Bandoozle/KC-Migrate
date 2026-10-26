import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:3001/services/outdoor-advertising/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const section = document.querySelector("main section");
  const img = section?.querySelector("img");
  return {
    src: img?.getAttribute("src"),
    alt: img?.getAttribute("alt"),
    nw: img?.naturalWidth,
    nh: img?.naturalHeight,
    box: img ? { w: Math.round(img.getBoundingClientRect().width), h: Math.round(img.getBoundingClientRect().height) } : null,
  };
});
console.log(JSON.stringify(info, null, 2));
const heading = page.getByRole("heading", { name: /From a single landmark/i });
await heading.scrollIntoViewIfNeeded();
await page.screenshot({ path: "tmp-audit/outdoor-redesign/outdoor-intro.png" });
await browser.close();

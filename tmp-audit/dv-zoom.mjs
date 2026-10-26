import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/services/digital-connected-tv/", { waitUntil: "networkidle" });
const partners = page.locator("#dv-partners").locator("xpath=ancestor::section");
await partners.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const grid = partners.locator("ul").first();
await grid.screenshot({ path: "tmp-audit/shots/dv2-zoom.png" });
// sample corner pixels of each image
const info = await page.evaluate(async () => {
  const out = [];
  for (const img of document.querySelectorAll("#dv-partners ~ * img, section img")) {
    if (!img.closest("[role=tabpanel]")) continue;
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d");
    try {
      ctx.drawImage(img, 0, 0);
      const px = (x, y) => Array.from(ctx.getImageData(x, y, 1, 1).data).slice(0, 4).join(",");
      out.push([img.alt, px(2, 2), px(c.width - 3, c.height - 3), px(c.width - 3, 2)]);
    } catch (e) {
      out.push([img.alt, "tainted"]);
    }
  }
  return out;
});
console.log(JSON.stringify(info));
await browser.close();

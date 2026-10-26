import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("response", (response) => {
  const url = response.url();
  if (url.includes("hvac-digital") || url.includes("youtube-advertising")) {
    console.log("RES", response.status(), url.slice(0, 180));
  }
});
await page.goto("http://127.0.0.1:3001/services/golf-marketing/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll("main img")];
  const last = imgs[imgs.length - 1];
  return {
    count: imgs.length,
    last: last
      ? {
          alt: last.alt,
          attr: last.getAttribute("src"),
          current: last.currentSrc,
          complete: last.complete,
          nw: last.naturalWidth,
        }
      : null,
  };
});
console.log(JSON.stringify(info, null, 2));
const food = page.locator("img[alt*='Food']");
await food.scrollIntoViewIfNeeded();
await food.screenshot({ path: "tmp-audit/direction/golf-food.png" });
await browser.close();

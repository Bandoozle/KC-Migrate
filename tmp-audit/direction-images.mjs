import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3001/services/golf-marketing/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
const images = await page.evaluate(() =>
  [...document.querySelectorAll("main img")].map((img) => ({
    alt: img.alt.slice(0, 70),
    w: img.naturalWidth,
    h: img.naturalHeight,
    src: img.currentSrc.slice(0, 140),
  })),
);
const frame = await page.locator("iframe").first().getAttribute("src");
console.log(JSON.stringify({ frame, images }, null, 2));
await browser.close();

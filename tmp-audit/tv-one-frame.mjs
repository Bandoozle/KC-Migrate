import { chromium } from "playwright";
import fs from "fs";

const src = process.argv[2];
const name = process.argv[3];
fs.mkdirSync("tmp-audit/tv-frames", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(15000);
await page.goto(src, { waitUntil: "domcontentloaded", timeout: 20000 });
await page.waitForTimeout(2500);
const meta = await page.evaluate(() => {
  const video = document.querySelector("video");
  if (!video) return { missing: true };
  return { duration: video.duration, width: video.videoWidth, height: video.videoHeight, ready: video.readyState };
});
console.log(name, meta);
await page.screenshot({ path: `tmp-audit/tv-frames/${name}.png` });
await browser.close();

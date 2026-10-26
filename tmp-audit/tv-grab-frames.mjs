import { chromium } from "playwright";
import fs from "fs";

const dir = "tmp-audit/tv-candidates";
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(`
  <style>html,body{margin:0;background:#000}video{width:1280px;height:720px;object-fit:contain;display:block}</style>
  <video id="v" src="https://staging.kosick.com/wp-content/uploads/2023/06/trane-web-1.mp4" muted playsinline preload="auto"></video>
`);
const video = page.locator("#v");
await video.evaluate((node) => new Promise((resolve, reject) => {
  const v = node;
  if (v.readyState >= 2) resolve();
  v.addEventListener("loadeddata", () => resolve(), { once: true });
  v.addEventListener("error", () => reject(new Error("video error")), { once: true });
}));
const times = [0.4, 2.5, 5, 8, 11, 14];
for (const time of times) {
  await video.evaluate((node, t) => new Promise((resolve) => {
    const v = node;
    const done = () => resolve();
    v.addEventListener("seeked", done, { once: true });
    v.currentTime = t;
  }), time);
  const file = `${dir}/frame-${String(time).replace(".", "_")}.png`;
  await video.screenshot({ path: file });
  console.log("wrote", file);
}
await browser.close();

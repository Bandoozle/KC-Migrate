import { chromium } from "playwright";
import fs from "fs";

const clips = [
  ["trane", "https://staging.kosick.com/wp-content/uploads/2023/06/trane-web-1.mp4"],
  ["bluejays", "https://staging.kosick.com/wp-content/uploads/2024/03/tv-bluejays-1.mp4"],
  ["f1", "https://staging.kosick.com/wp-content/uploads/2024/03/tv-f2.mp4"],
  ["tv", "https://staging.kosick.com/wp-content/uploads/2024/03/tv-1.mp4"],
  ["howwerun", "https://staging.kosick.com/wp-content/uploads/2024/03/tr_how-we-run_70_16x9_020323104508_hd-1.mp4"],
  ["kc", "https://staging.kosick.com/wp-content/uploads/2023/06/KC-Mov-3.mp4"],
];

fs.mkdirSync("tmp-audit/tv-frames", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });

for (const [name, src] of clips) {
  await page.setContent(
    `<video id="v" src="${src}" muted playsinline preload="auto" style="width:960px;height:540px;object-fit:contain;background:#000"></video>`,
  );
  const meta = await page.evaluate(async () => {
    const video = document.querySelector("video");
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = () => reject(new Error("video error"));
    });
    const duration = video.duration;
    const times = [Math.min(1, duration / 2), Math.min(duration * 0.45, Math.max(duration - 0.4, 0))];
    const shots = [];
    for (const time of times) {
      video.currentTime = time;
      await new Promise((resolve) => {
        video.onseeked = resolve;
      });
      shots.push(time);
    }
    return { duration, width: video.videoWidth, height: video.videoHeight, shots };
  }).catch((error) => ({ error: error.message }));
  console.log(name, meta);
  if (!meta.error) {
    await page.locator("video").screenshot({ path: `tmp-audit/tv-frames/${name}.png` });
  }
}
await browser.close();

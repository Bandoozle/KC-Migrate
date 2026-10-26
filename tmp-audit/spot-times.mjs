import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const src = "https://staging.kosick.com/wp-content/uploads/2023/06/trane-web-1.mp4";
const page = await browser.newPage({ viewport: { width: 600, height: 400 } });
await page.setContent(`<body style="margin:0;background:#000"><video id="v" src="${src}" muted preload="auto" style="width:480px"></video></body>`);
await page.waitForFunction(() => document.getElementById("v").readyState >= 2, null, { timeout: 60000 });
const duration = await page.evaluate(() => document.getElementById("v").duration);
console.log("duration", duration);
for (const t of [0.5, 2, 3.5, 5, 6.5, 8, 9.5, 11, 12.5, 14, 15]) {
  await page.evaluate(
    (time) =>
      new Promise((resolve) => {
        const v = document.getElementById("v");
        v.onseeked = () => resolve();
        v.currentTime = time;
      }),
    t,
  );
  await page.waitForTimeout(150);
  await page.locator("#v").screenshot({ path: `tmp-audit/spot-t${String(t).replace(".", "_")}.png` });
}
await browser.close();

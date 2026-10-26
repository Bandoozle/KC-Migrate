import { chromium } from "playwright";
const videos = [
  "2024/03/hvac.mp4",
  "2023/06/KC-Mov-3.mp4",
  "2017/12/2016-12-21_CGI.mp4",
  "2024/03/tr_how-we-run_70_16x9_020323104508_hd-1.mp4",
];
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
for (const [i, v] of videos.entries()) {
  const url = `https://staging.kosick.com/wp-content/uploads/${v}`;
  await page.setContent(`<style>body{margin:0;background:#000}video{width:960px;height:540px;object-fit:contain}</style><video muted playsinline preload="auto" src="${url}"></video>`);
  const meta = await page.evaluate(
    () =>
      new Promise((res) => {
        const el = document.querySelector("video");
        el.addEventListener("loadedmetadata", () => res({ d: el.duration, w: el.videoWidth, h: el.videoHeight }), { once: true });
        el.addEventListener("error", () => res({ error: true }), { once: true });
        setTimeout(() => res({ timeout: true }), 30000);
      }),
  );
  console.log(i, v, JSON.stringify(meta));
  if (!meta.d) continue;
  for (const frac of [0.12, 0.4, 0.75]) {
    await page.evaluate(
      (t) =>
        new Promise((res) => {
          const el = document.querySelector("video");
          el.addEventListener("seeked", () => res(), { once: true });
          el.currentTime = t;
          setTimeout(res, 15000);
        }),
      meta.d * frac,
    );
    await page.waitForTimeout(300);
    await page.screenshot({ path: `tmp-audit/shots/cr-frame-${i}-${Math.round(frac * 100)}.png` });
  }
}
await browser.close();

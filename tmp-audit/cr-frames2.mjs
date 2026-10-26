import { chromium } from "playwright";
const U = "https://staging.kosick.com/wp-content/uploads/";
const videos = [
  "2024/03/hvac.mp4",
  "2023/06/KC-Mov-3.mp4",
  "2017/12/2016-12-21_CGI.mp4",
  "2024/03/tr_how-we-run_70_16x9_020323104508_hd-1.mp4",
];
for (const id of ["1055705517", "230179843"]) {
  const r = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1920`);
  console.log(id, r.status, r.ok ? JSON.stringify(await r.json()).slice(0, 600) : "");
}
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("http://localhost:3000/services/creative/", { waitUntil: "load", timeout: 90000 });
for (const [i, v] of videos.entries()) {
  const meta = await page.evaluate(
    (src) =>
      new Promise((res) => {
        document.body.innerHTML = "";
        document.body.style.margin = "0";
        const el = document.createElement("video");
        el.muted = true;
        el.preload = "auto";
        el.style.cssText = "width:1280px;height:720px;object-fit:contain;background:#000;display:block";
        el.src = src;
        document.body.appendChild(el);
        el.addEventListener("loadedmetadata", () => res({ d: el.duration, w: el.videoWidth, h: el.videoHeight }), { once: true });
        el.addEventListener("error", () => res({ error: el.error?.code }), { once: true });
        setTimeout(() => res({ timeout: true, rs: el.readyState, ns: el.networkState }), 45000);
      }),
    U + v,
  );
  console.log(i, v, JSON.stringify(meta));
  if (!meta.d) continue;
  for (const frac of [0.1, 0.35, 0.6, 0.85]) {
    await page.evaluate(
      (t) =>
        new Promise((res) => {
          const el = document.querySelector("video");
          el.addEventListener("seeked", () => res(), { once: true });
          el.currentTime = t;
          setTimeout(res, 20000);
        }),
      meta.d * frac,
    );
    await page.waitForTimeout(400);
    await page.screenshot({ path: `tmp-audit/shots/cr-frame-${i}-${Math.round(frac * 100)}.png` });
  }
}
await browser.close();

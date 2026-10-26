import fs from "node:fs";
import { chromium } from "playwright";
const U = "https://staging.kosick.com/wp-content/uploads/";
const jobs = [
  ["2023/06/KC-Mov-3.mp4", [[0.35, "reel-aerial"]]],
  ["2024/03/hvac.mp4", [[0.1, "reel-spot"]]],
  ["2017/12/2016-12-21_CGI.mp4", [[0.35, "render-aerial"]]],
  [
    "2024/03/tr_how-we-run_70_16x9_020323104508_hd-1.mp4",
    [
      [0.1, "motion-01"],
      [0.35, "motion-02"],
      [0.6, "motion-03"],
      [0.85, "motion-04"],
    ],
  ],
];
fs.mkdirSync("public/images/creative", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto("http://localhost:3000/services/creative/", { waitUntil: "load", timeout: 90000 });
for (const [v, frames] of jobs) {
  const d = await page.evaluate(
    (src) =>
      new Promise((res) => {
        document.body.innerHTML = "";
        document.body.style.margin = "0";
        const el = document.createElement("video");
        el.muted = true;
        el.preload = "auto";
        el.style.cssText = "width:1600px;height:900px;object-fit:cover;background:#000;display:block";
        el.src = src;
        document.body.appendChild(el);
        el.addEventListener("loadedmetadata", () => res(el.duration), { once: true });
        setTimeout(() => res(0), 45000);
      }),
    U + v,
  );
  for (const [frac, name] of frames) {
    await page.evaluate(
      (t) =>
        new Promise((res) => {
          const el = document.querySelector("video");
          el.addEventListener("seeked", () => res(), { once: true });
          el.currentTime = t;
          setTimeout(res, 20000);
        }),
      d * frac,
    );
    await page.waitForTimeout(500);
    await page.screenshot({ path: `public/images/creative/${name}.jpg`, type: "jpeg", quality: 82 });
    console.log(name, "t=", (d * frac).toFixed(2));
  }
}
await browser.close();

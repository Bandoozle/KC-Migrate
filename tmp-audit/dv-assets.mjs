import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const dir = "tmp-audit/dv-img";
await mkdir(dir, { recursive: true });

const urls = [
  "https://staging.kosick.com/wp-content/uploads/2026/06/ott-streaming-advertising.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/streaming-video-ads.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/connected-tv-streaming.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/digital-streaming-advertising.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/digital-streaming-advertising-1.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/tv-streaming-advertising-1.jpg",
  "https://staging.kosick.com/wp-content/uploads/2023/06/streaming-ads.png",
  "https://staging.kosick.com/wp-content/uploads/2023/06/pre-roll-streaming.png",
  "https://staging.kosick.com/wp-content/uploads/2024/08/sportsnet-advertising.webp",
  "https://staging.kosick.com/wp-content/uploads/2026/06/digital-streaming-platforms.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/02/media-buying.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/01/media-buying.jpg",
];

for (const url of urls) {
  const name = url.split("/").pop();
  const res = await fetch(url);
  console.log(res.status, name, res.headers.get("content-type"));
  if (!res.ok) continue;
  await writeFile(`${dir}/${name}`, Buffer.from(await res.arrayBuffer()));
}

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/digital-connected-tv/", { waitUntil: "networkidle", timeout: 120000 });
const info = await page.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent?.trim(),
  headings: [...document.querySelectorAll("main h2, main h3, main h4")].map((el) => `${el.tagName} ${el.textContent.replace(/\s+/g, " ").trim()}`),
  links: [...document.querySelectorAll("main a")].map((a) => `${a.textContent.replace(/\s+/g, " ").trim().slice(0, 60)} -> ${a.getAttribute("href")}`),
  imgs: [...document.querySelectorAll("main img")].map((img) => {
    const src = img.currentSrc || img.src;
    let real = src;
    try { real = decodeURIComponent(new URL(src).searchParams.get("url") || src); } catch {}
    return `${img.alt.slice(0, 80)} | ${real.split("/").slice(-2).join("/")}`;
  }),
}));
console.log(JSON.stringify(info, null, 2));
await browser.close();

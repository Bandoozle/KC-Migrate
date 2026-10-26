import { chromium } from "playwright";
const U = "https://staging.kosick.com/wp-content/uploads/";
const imgs = [
  "2023/06/KOSICK-MODEL-LOWER-LEVEL-MARCH-17-2023-ROUGH-2-1-e1686846929767.jpg",
  "2023/06/3_1-e1687219689277.jpeg",
  "2023/06/tcs2017-08_noritz_basement_front_final_v1-2-1-e1687153222220.jpg",
  "2022/01/Motor-Court.webp",
  "2023/06/Trane_WRT_HeatUnit_Shot3_0232_251022133344-e1686845864632.jpg",
  "2021/07/video-scaled.jpg",
  "2021/07/content-scaled.jpg",
  "2021/07/audio-recording.jpg",
  "2023/06/MBYMockupcards2.jpeg",
  "2023/06/packaging.jpg",
  "2023/06/print-ads.jpg",
  "2023/06/product-packaging.jpg",
  "2023/06/business-cards-printing.jpg",
  "2026/06/arcteryx-billboard-advertising.jpg",
  "2026/06/social-media-marketing.jpg",
  "2026/01/outdoor-billboard-advertising.jpg",
  "2026/06/social-media-content-marketing-1-640x960.jpg",
  "2026/06/corporate-branding.jpg",
  "2026/06/hvac-billboard-advertising.jpg",
  "2024/03/transit-shelter-ads.webp",
  "2023/06/hearth-advertising.jpg",
  "2026/06/billboard-2.jpg",
  "2023/06/services.jpg",
  "2026/06/tv-advertising-750x600.jpg",
  "2023/06/Screenshot-2023-06-15-at-10.08.46-AM-1-e1686849205908.jpg",
  "2022/01/hvac.webp",
  "2026/06/kosick-communications-branding.jpg",
  "2023/06/kccardmockup4.jpg",
];
const html = `<style>body{margin:0;font:12px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:6px;background:#ddd}figure{margin:0;background:#fff}img{width:100%;height:220px;object-fit:contain;background:#222;display:block}figcaption{padding:3px;word-break:break-all}</style>${imgs
  .map((s, i) => `<figure><img src="${U}${s}"><figcaption>${i} ${s.split("/").pop()} <span class=d></span></figcaption></figure>`)
  .join("")}`;
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.setContent(html, { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(1500);
const dims = await page.evaluate(() => [...document.images].map((im, i) => `${i}:${im.naturalWidth}x${im.naturalHeight}`));
console.log(dims.join(" "));
await page.screenshot({ path: "tmp-audit/shots/cr-sheet.png", fullPage: true });
await browser.close();

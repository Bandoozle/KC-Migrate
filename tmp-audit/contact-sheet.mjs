import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const times = ["0_5", "2", "3_5", "5", "6_5", "8", "9_5", "11", "12_5", "14", "15"];
const cells = times
  .map((t) => {
    const data = readFileSync(`tmp-audit/spot-t${t}.png`).toString("base64");
    return `<figure><img src="data:image/png;base64,${data}"><figcaption>${t.replace("_", ".")}s</figcaption></figure>`;
  })
  .join("");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 600 } });
await page.setContent(`<style>body{margin:0;background:#222;color:#fff;font:14px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:6px}figure{margin:0}img{width:100%;display:block}</style>${cells}`);
await page.screenshot({ path: "tmp-audit/spot-sheet.png", fullPage: true });
await browser.close();

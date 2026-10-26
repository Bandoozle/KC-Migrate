import fs from "node:fs";
import { chromium } from "playwright";
const files = fs.readdirSync("tmp-audit/shots").filter((f) => /^cr-frame-\d-\d+\.png$/.test(f)).sort();
const html = `<style>body{margin:0;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;background:#888;font:14px sans-serif}figure{margin:0}img{width:100%;display:block}figcaption{background:#fff;padding:2px}</style>${files
  .map((f) => `<figure><img src="data:image/png;base64,${fs.readFileSync("tmp-audit/shots/" + f).toString("base64")}"><figcaption>${f}</figcaption></figure>`)
  .join("")}`;
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });
await page.setContent(html);
await page.screenshot({ path: "tmp-audit/shots/cr-framesheet.png", fullPage: true });
await browser.close();

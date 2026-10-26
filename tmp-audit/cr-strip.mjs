import fs from "node:fs";
import { chromium } from "playwright";
const [tag, width, out] = process.argv.slice(2);
const files = fs
  .readdirSync("tmp-audit/shots")
  .filter((f) => f.startsWith(`cr-${tag}-${width}-`))
  .sort((a, b) => Number(a.match(/-(\d+)\.png$/)[1]) - Number(b.match(/-(\d+)\.png$/)[1]));
const html = `<style>body{margin:0;display:flex;gap:8px;align-items:flex-start;background:#999}img{width:300px;display:block}</style>${files
  .map((f) => `<img src="data:image/png;base64,${fs.readFileSync("tmp-audit/shots/" + f).toString("base64")}">`)
  .join("")}`;
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: files.length * 308, height: 800 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();

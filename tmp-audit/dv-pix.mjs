import sharp from "sharp";
import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage();
await page.goto("http://localhost:3000/services/digital-connected-tv/", { waitUntil: "networkidle" });
const logos = await page.$$eval("[role=tabpanel] img", (els) => els.map((e) => ({ src: e.src, alt: e.alt })));
await browser.close();
for (const logo of logos) {
  const buf = Buffer.from(await (await fetch(logo.src)).arrayBuffer());
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const at = (fx, fy) => {
    const x = Math.round(info.width * fx);
    const y = Math.round(info.height * fy);
    const i = (y * info.width + x) * 3;
    return `${data[i]},${data[i + 1]},${data[i + 2]}`;
  };
  console.log(logo.alt.padEnd(18), info.width, info.height, "tl", at(0.02, 0.02), "br", at(0.97, 0.97), "r85b85", at(0.85, 0.85), "l85b85", at(0.15, 0.85));
}

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [, , path = "/services/radio-advertising/", widthsArg = "1440", tag = "radio", only = ""] = process.argv;
const widths = widthsArg.split(",").map(Number);
mkdirSync("tmp-audit/shots", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`http://localhost:3001${path}`, { waitUntil: "networkidle", timeout: 120000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
  });
  await page.waitForTimeout(500);
  const sections = await page.$$("main > section");
  for (const [index, section] of sections.entries()) {
    const name = (await section.getAttribute("class")).split(" ").pop().split("__")[1] || `s${index}`;
    if (only && !only.split(",").includes(name)) continue;
    await section.screenshot({ path: `tmp-audit/shots/${tag}-${width}-${index}-${name}.png` });
    const box = await section.boundingBox();
    console.log(width, index, name, Math.round(box.height));
  }
  await page.close();
}
await browser.close();

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("tmp-audit/outdoor-redesign");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const pages = [
  ["outdoor", "/services/outdoor-advertising/"],
  ["sizes", "/services/outdoor-advertising/billboard-dimensions/"],
];

for (const [name, route] of pages) {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1100 } });
    const response = await page.goto(`http://127.0.0.1:3001${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(700);
    const info = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll("main img")].map((img) => ({
        alt: img.getAttribute("alt"),
        w: Math.round(img.getBoundingClientRect().width),
        h: Math.round(img.getBoundingClientRect().height),
      }));
      return {
        status: document.body.innerText.includes("Application error") ? "error" : "ok",
        h1: document.querySelectorAll("h1").length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        imgs,
      };
    });
    await page.screenshot({ path: path.join(outDir, `${name}-${width}.png`), fullPage: true });
    console.log(name, width, response?.status(), JSON.stringify(info));
    await page.close();
  }
}
await browser.close();

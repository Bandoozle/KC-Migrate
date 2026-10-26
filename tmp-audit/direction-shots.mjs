import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("tmp-audit/direction");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const [name, route] of [
  ["golf", "/services/golf-marketing/"],
  ["dental", "/services/dental-marketing/"],
]) {
  for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.goto(`http://127.0.0.1:3001${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator("h1").waitFor();
    await page.waitForTimeout(600);
    const info = await page.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      h1Text: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
      canonical: document.querySelector("link[rel=canonical]")?.getAttribute("href"),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      buttons: [...document.querySelectorAll("main a")].slice(0, 6).map((node) => {
        const style = getComputedStyle(node);
        return {
          text: node.textContent?.replace(/\s+/g, " ").trim().slice(0, 40),
          color: style.color,
          background: style.backgroundColor,
        };
      }),
    }));
    await page.screenshot({ path: path.join(outDir, `${name}-${width}.png`), fullPage: true });
    console.log(name, width, JSON.stringify(info));
    await page.close();
  }
}

await browser.close();

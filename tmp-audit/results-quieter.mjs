import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3001";
const outDir = path.resolve("tmp-audit/results-quieter");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const notes = [];

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto(`${base}/marketing-results/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#collection-heading").waitFor();
  await page.waitForTimeout(500);
  const measured = await page.evaluate(() => {
    const section = document.getElementById("collection-heading").closest("section");
    const tiles = [...section.querySelectorAll("[data-project]")].slice(0, 6);
    const panels = [...document.querySelectorAll("article[data-project]")].slice(0, 3);
    const imageHeight = (node) => Math.round(node.querySelector("img")?.parentElement?.getBoundingClientRect().height || 0);
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      panels: panels.map((node) => ({ id: node.getAttribute("data-project"), image: imageHeight(node) })),
      tiles: tiles.map((node) => ({ id: node.getAttribute("data-project"), image: imageHeight(node) })),
    };
  });
  await page.locator("#collection-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, `collection-${width}.png`) });
  notes.push({ width, ...measured });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(notes, null, 2));

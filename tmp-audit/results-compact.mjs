import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3011";
const outDir = path.resolve("tmp-audit/results-compact");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const notes = [];

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const response = await page.goto(`${base}/marketing-results/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("article[data-project]").first().waitFor();
  await page.waitForTimeout(400);
  const measured = await page.evaluate(() => {
    const panels = [...document.querySelectorAll("article[data-project]")].slice(0, 3);
    const tiles = [...document.querySelectorAll("#collection-heading")[0].closest("section").querySelectorAll("[data-project]")];
    const box = (node) => {
      const image = node.querySelector("img")?.parentElement;
      const imageRect = image?.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        id: node.getAttribute("data-project"),
        top: Math.round(node.getBoundingClientRect().top + window.scrollY),
        imageHeight: Math.round(imageRect?.height || 0),
        radius: style.borderRadius,
      };
    };
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll("h1").length,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
      jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
      panels: panels.map(box),
      tiles: tiles.slice(0, 4).map(box),
    };
  });
  await page.locator("article[data-project]").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, `stage-${width}.png`) });
  await page.locator("#collection-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, `collection-${width}.png`) });
  notes.push({ width, status: response?.status(), ...measured });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(notes, null, 2));

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3011";
const outDir = path.resolve("tmp-audit/results-grid");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const notes = [];

function summarize(cards) {
  const rows = [];
  for (let index = 0; index < cards.length; index += 2) {
    const pair = cards.slice(index, index + 2);
    const tops = pair.map((card) => card.top);
    const bottoms = pair.map((card) => card.bottom);
    const heights = pair.map((card) => card.height);
    rows.push({
      ids: pair.map((card) => card.id),
      tops,
      bottoms,
      heights,
      sameTop: new Set(tops).size === 1,
      sameBottom: new Set(bottoms).size === 1,
      sameHeight: new Set(heights).size === 1,
    });
  }
  const gaps = [];
  for (let index = 0; index < cards.length; index += 1) {
    const next = cards[index + 1];
    if (!next) continue;
    if (cards[index].top === next.top) {
      gaps.push({ kind: "x", value: next.left - cards[index].right });
    } else if (index % 2 === 0) {
      const below = cards[index + 2];
      if (below) gaps.push({ kind: "y", value: below.top - cards[index].bottom });
    }
  }
  return { rows, gaps };
}

async function measure(page) {
  return page.evaluate(() => {
    const section = document.getElementById("collection-heading").closest("section");
    return [...section.querySelectorAll("[data-project]")].map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        id: node.getAttribute("data-project"),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        height: Math.round(rect.height),
        width: Math.round(rect.width),
      };
    });
  });
}

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto(`${base}/marketing-results/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#collection-heading").waitFor();
  await page.waitForTimeout(400);
  const more = page.getByRole("button", { name: /Load more/i });
  if (await more.count()) {
    await more.click();
    await page.waitForTimeout(300);
  }
  const cards = await measure(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.locator("#collection-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, `collection-${width}.png`) });
  notes.push({ width, overflow, count: cards.length, ...summarize(cards) });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(`${base}/marketing-results/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(800);
await page.getByRole("button", { name: "Creative", exact: true }).click();
await page.waitForTimeout(300);
const creative = await measure(page);
await page.screenshot({ path: path.join(outDir, "creative-1440.png") });
notes.push({ filter: "creative", count: creative.length, ...summarize(creative) });

await browser.close();
console.log(JSON.stringify(notes, null, 2));

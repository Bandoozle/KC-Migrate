import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.env.RESULTS_URL || "http://127.0.0.1:3001";
const outDir = path.resolve("tmp-audit/results-alternate");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const notes = [];

async function measure(page) {
  return page.evaluate(() => {
    const section = document.getElementById("collection-heading").closest("section");
    const rows = [...section.querySelectorAll("[class*='rowForward'], [class*='rowReverse']")];
    const bars = [...section.querySelectorAll("[class*='tileCopy']")].map((node) => {
      const box = node.getBoundingClientRect();
      const title = node.querySelector("h3")?.getBoundingClientRect();
      return {
        height: Math.round(box.height),
        padTop: Math.round(title.top - box.top),
      };
    });
    return {
      count: section.querySelectorAll("[data-project]").length,
      bars,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rows: rows.map((row) => {
        const cards = [...row.querySelectorAll("[data-project]")].map((node) => {
          const card = node.getBoundingClientRect();
          const image = node.querySelector("img");
          return {
            id: node.getAttribute("data-project"),
            top: Math.round(card.top),
            bottom: Math.round(card.bottom),
            height: Math.round(card.height),
            width: Math.round(card.width),
            left: Math.round(card.left),
            fit: image ? getComputedStyle(image).objectFit : null,
          };
        });
        const rowBox = row.getBoundingClientRect();
        const next = row.nextElementSibling?.getBoundingClientRect();
        const stacked = cards.length === 2 && cards[1].top > cards[0].bottom - 2;
        return {
          kind: row.className.includes("rowReverse") ? "reverse" : "forward",
          rowHeight: Math.round(rowBox.height),
          rowGap: next ? Math.round(next.top - rowBox.bottom) : null,
          innerGap:
            cards.length === 2 && !stacked ? Math.round(cards[1].left - (cards[0].left + cards[0].width)) : null,
          stacked,
          cards,
        };
      }),
    };
  });
}

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 1400 } });
  await page.goto(`${base}/marketing-results/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#collection-heading").waitFor({ timeout: 20000 });
  await page.waitForTimeout(700);
  const before = await measure(page);
  const more = page.getByRole("button", { name: /Load more/i });
  if (await more.count()) {
    await more.click();
    await page.waitForTimeout(400);
  }
  const loaded = await measure(page);
  const creative = page.getByRole("button", { name: "Creative", exact: true });
  if (await creative.count()) {
    await creative.click();
    await page.waitForTimeout(400);
  }
  const filtered = await measure(page);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.waitForTimeout(300);
  const mosaic = page.locator("#collection-heading").locator("xpath=ancestor::section[1]").locator("[class*='mosaic']");
  await mosaic.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(outDir, `collection-${width}.png`) });
  const summarize = (data) => ({
    count: data.count,
    overflow: data.overflow,
    barHeights: [...new Set(data.bars.map((bar) => bar.height))],
    barPads: [...new Set(data.bars.map((bar) => bar.padTop))],
    rows: data.rows.map((row) => ({
      kind: row.kind,
      height: row.cards[0]?.height,
      aligned: row.cards.every((card) => card.top === row.cards[0].top && card.bottom === row.cards[0].bottom),
      widths: row.cards.map((card) => card.width),
      gap: row.innerGap,
      rowGap: row.rowGap,
      stacked: row.stacked,
      fit: [...new Set(row.cards.map((card) => card.fit))],
    })),
  });
  notes.push({
    width,
    initial: before.count,
    loaded: summarize(loaded),
    filtered: summarize(filtered),
  });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(notes, null, 2));

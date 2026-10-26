import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3001";
const outDir = path.resolve("tmp-audit/results-variety");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const notes = [];

async function read(page) {
  return page.evaluate(() => {
    const section = document.getElementById("collection-heading").closest("section");
    const rows = [...section.querySelectorAll("[class*='rowLandscape'], [class*='rowFeature']")];
    return rows.map((row) => {
      const cards = [...row.querySelectorAll("[data-project]")].map((node) => {
        const card = node.getBoundingClientRect();
        const image = node.querySelector("img")?.parentElement?.getBoundingClientRect();
        return {
          id: node.getAttribute("data-project"),
          top: Math.round(card.top),
          bottom: Math.round(card.bottom),
          left: Math.round(card.left),
          right: Math.round(card.right),
          height: Math.round(card.height),
          width: Math.round(card.width),
          imageWidth: Math.round(image?.width || 0),
          imageHeight: Math.round(image?.height || 0),
        };
      });
      const next = row.nextElementSibling;
      const gap = next?.getBoundingClientRect
        ? Math.round(next.getBoundingClientRect().top - row.getBoundingClientRect().bottom)
        : null;
      const innerGap = cards.length === 2 ? cards[1].width && Math.round(cards[1].left - cards[0].right) : null;
      return {
        cards,
        rowGap: gap,
        innerGap: cards.length === 2 ? Math.round(cards[1].left - cards[0].right) : null,
      };
    });
  });
}

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 1100 } });
  await page.goto(`${base}/marketing-results/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#collection-heading").waitFor();
  await page.waitForTimeout(500);
  const more = page.getByRole("button", { name: /Load more/i });
  if (await more.count()) await more.click();
  await page.waitForTimeout(250);
  await page.locator("#collection-heading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const rows = await read(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: path.join(outDir, `collection-${width}.png`) });
  notes.push({ width, overflow, rows });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(notes, null, 2));

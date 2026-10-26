import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3011";
const outDir = path.resolve("tmp-audit/results-bars");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const notes = [];

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${base}/marketing-results/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#collection-heading").waitFor();
  await page.waitForTimeout(800);
  const more = page.getByRole("button", { name: /Load more/i });
  const moreCount = await more.count();
  if (moreCount) {
    await more.click();
    await page.locator("#collection-heading").locator("xpath=ancestor::section[1]").locator("[data-project]").nth(9).waitFor({ timeout: 5000 });
  }
  const firstBar = page.locator("#collection-heading").locator("xpath=ancestor::section[1]").locator("h3").first();
  await firstBar.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const measured = await page.evaluate(() => {
    const section = document.getElementById("collection-heading")?.closest("section");
    const cards = [...(section?.querySelectorAll("[data-project]") || [])];
    return cards.map((card) => {
      const title = card.querySelector("h3");
      const bar = title?.parentElement;
      const summary = bar?.querySelector("p:last-of-type");
      const barRect = bar?.getBoundingClientRect();
      const titleRect = title?.getBoundingClientRect();
      const summaryRect = summary?.getBoundingClientRect();
      const summaryStyle = summary ? getComputedStyle(summary) : null;
      return {
        title: title?.textContent?.trim(),
        bar: Math.round(barRect?.height || 0),
        titleTop: Math.round((titleRect?.top || 0) - (barRect?.top || 0)),
        summaryTop: Math.round((summaryRect?.top || 0) - (barRect?.top || 0)),
        summaryLines: summaryStyle?.webkitLineClamp || summaryStyle?.lineClamp || "",
        summaryScroll: summary?.scrollHeight || 0,
        summaryClient: summary?.clientHeight || 0,
      };
    });
  });
  const bars = [...new Set(measured.map((item) => item.bar))];
  const titleTops = [...new Set(measured.map((item) => item.titleTop))];
  const summaryTops = [...new Set(measured.map((item) => item.summaryTop))];
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: path.join(outDir, `collection-${width}.png`) });
  notes.push({ width, moreCount, count: measured.length, bars, titleTops, summaryTops, overflow });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(notes, null, 2));

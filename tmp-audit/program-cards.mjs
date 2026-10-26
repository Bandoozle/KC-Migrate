import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("tmp-audit/program-cards");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const width of [390, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1100 } });
  await page.goto("http://127.0.0.1:3001/marketing-programs/", { waitUntil: "domcontentloaded", timeout: 60000 });
  const heading = page.getByRole("heading", { name: "More Than a Campaign. A Complete Marketing Partner." });
  await heading.waitFor({ timeout: 20000 });
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const box = await heading.evaluate((node) => {
    const section = node.closest("section");
    const cards = [...section.querySelectorAll("li")].map((card) => {
      const style = getComputedStyle(card);
      const rect = card.getBoundingClientRect();
      return {
        title: card.querySelector("h3")?.textContent?.trim(),
        radius: style.borderRadius,
        bg: style.backgroundColor,
        border: style.borderTopWidth,
        h: Math.round(rect.height),
        w: Math.round(rect.width),
      };
    });
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      cards,
    };
  });
  const section = heading.locator("xpath=ancestor::section[1]");
  await section.screenshot({ path: path.join(outDir, `why-${width}.png`) });
  console.log(width, JSON.stringify(box));
  await page.close();
}

await browser.close();

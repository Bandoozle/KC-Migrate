import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/solutions";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded", timeout: 60000 });
  const heading = page.getByRole("heading", { name: "Our bespoke solutions" });
  await heading.waitFor({ timeout: 20000 });
  const section = page.locator("section").filter({ has: heading });
  await section.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const heading = [...document.querySelectorAll("h2")].find((node) =>
      node.textContent?.includes("Our bespoke solutions"),
    );
    const root = heading?.closest("section");
    if (!root) return false;
    const images = [...root.querySelectorAll("img")];
    return images.length === 6 && images.every((img) => img.complete && img.naturalWidth > 0);
  });
  await page.waitForTimeout(400);
  const metrics = await section.evaluate((node) => {
    const cards = [...node.querySelectorAll("a")].map((card) => {
      const rect = card.getBoundingClientRect();
      const img = card.querySelector("img");
      return {
        title: card.querySelector("h3")?.textContent?.trim(),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
        natural: img ? `${img.naturalWidth}x${img.naturalHeight}` : null,
        rendered: img ? `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}` : null,
        src: img?.currentSrc || img?.src || "",
        href: card.getAttribute("href"),
      };
    });
    const description = node.querySelector("p");
    const style = description ? getComputedStyle(description) : null;
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      description: style
        ? { fontSize: style.fontSize, color: style.color, lineHeight: style.lineHeight }
        : null,
      cards,
    };
  });
  await section.screenshot({ path: `${outDir}/solutions-${width}.png` });
  console.log(JSON.stringify({ width, ...metrics }, null, 2));
  await page.close();
}

await browser.close();

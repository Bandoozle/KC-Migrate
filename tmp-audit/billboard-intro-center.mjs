import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("tmp-audit/billboard-cards");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:3001/services/outdoor-advertising/billboard-dimensions/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  const intro = page.locator("h2", { hasText: "Billboard dimensions in Canada" });
  await intro.waitFor();
  await page.waitForTimeout(400);
  const box = await intro.evaluate((node) => {
    const section = node.closest("section");
    const lead = node.parentElement?.querySelector("p");
    const button = node.parentElement?.querySelector("a");
    const sectionBox = section.getBoundingClientRect();
    const read = (el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        textAlign: style.textAlign,
        left: Math.round(rect.left - sectionBox.left),
        right: Math.round(sectionBox.right - rect.right),
        width: Math.round(rect.width),
      };
    };
    return {
      heading: read(node),
      lead: read(lead),
      button: read(button),
    };
  });
  await intro.locator("xpath=..").screenshot({ path: path.join(outDir, `intro-center-${width}.png`) });
  console.log(width, JSON.stringify(box));
  await page.close();
}

await browser.close();

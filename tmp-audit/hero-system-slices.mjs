import { chromium } from "playwright";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const outDir = path.resolve("tmp-audit/hero-system/slices");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

async function slices(name, route, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`http://127.0.0.1:3001${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("h1").first().waitFor();
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  const height = await page.evaluate(() => document.body.scrollHeight);
  let index = 0;
  for (let y = 0; y < height; y += 850) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
    await page.screenshot({ path: path.join(outDir, `${name}-${width}-${index}.png`) });
    index += 1;
  }
  if (width === 390 && name === "hvac") {
    const offenders = await page.evaluate(() => {
      const view = document.documentElement.clientWidth;
      return [...document.querySelectorAll("body *")]
        .filter((el) => el.scrollWidth > view + 8)
        .slice(0, 12)
        .map((el) => ({
          tag: el.tagName,
          className: String(el.className).slice(0, 140),
          scrollWidth: el.scrollWidth,
          text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
        }));
    });
    console.log(JSON.stringify(offenders, null, 2));
  }
  await page.close();
}

await slices("golf", "/services/golf-marketing/", 1440);
await slices("golf", "/services/golf-marketing/", 390);
await slices("dental", "/services/dental-marketing/", 1440);
await slices("hvac", "/services/hvac-marketing/", 390);
await slices("hvac", "/services/hvac-marketing/", 1440);
await browser.close();

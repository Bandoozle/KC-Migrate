import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("tmp-audit/golf-sharp");
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3001/services/golf-marketing/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.locator("h1").waitFor();
  await page.waitForTimeout(800);
  const report = await page.evaluate(() =>
    [...document.querySelectorAll("main img")].map((img) => ({
      alt: (img.alt || "").slice(0, 42),
      natural: `${img.naturalWidth}x${img.naturalHeight}`,
      rendered: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
      upscaled: Math.round(img.getBoundingClientRect().width) > img.naturalWidth + 1,
    })),
  );
  console.log(width, JSON.stringify(report));
  const hero = await page.locator("h1").locator("xpath=ancestor::section[1]").boundingBox();
  if (hero) {
    await page.screenshot({
      path: path.join(dir, `hero-${width}.png`),
      clip: { x: 0, y: 0, width, height: Math.min(900, Math.ceil(hero.y + hero.height)) },
    });
  }
  const course = page.locator('img[alt*="clubs"]').first();
  if (await course.count()) {
    await course.scrollIntoViewIfNeeded();
    const box = await course.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(dir, `course-${width}.png`),
        clip: { x: 0, y: Math.max(0, box.y - 20), width, height: Math.min(480, box.height + 40) },
      });
    }
  }
  await page.screenshot({ path: path.join(dir, `page-${width}.png`), fullPage: true });
  await page.close();
}

await browser.close();

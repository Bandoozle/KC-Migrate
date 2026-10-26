import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("tmp-audit/seo-review");
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();

async function ready(page) {
  await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.locator("h1").waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll("main img")].every((img) => img.complete && img.naturalWidth > 0),
  );
  await page.waitForTimeout(400);
}

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await ready(page);
  const metrics = await page.evaluate(() => {
    const hero = document.querySelector("h1")?.closest("section");
    return {
      heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      imgs: [...document.querySelectorAll("main img")].map((img) => {
        const box = img.getBoundingClientRect();
        return {
          natural: `${img.naturalWidth}x${img.naturalHeight}`,
          rendered: `${Math.round(box.width)}x${Math.round(box.height)}`,
          upscaled:
            Math.round(box.width) > img.naturalWidth + 1 ||
            Math.round(box.height) > img.naturalHeight + 1,
        };
      }),
    };
  });
  console.log(width, JSON.stringify(metrics));
  await page.screenshot({ path: path.join(dir, `hero-${width}.png`) });
  const search = page.locator("h2", { hasText: "Search engine optimization (SEO)" });
  await search.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(dir, `search-${width}.png`) });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await ready(page);
await page.locator("#seo-capability-3").click();
await page.waitForTimeout(250);
console.log("panel", (await page.locator("#seo-capability-panel").innerText()).slice(0, 80));
console.log("selected", await page.locator("#seo-capability-3").getAttribute("aria-selected"));
await page.locator("#seo-capability-3").focus();
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(150);
console.log("after arrow", (await page.locator("#seo-capability-panel").innerText()).slice(0, 60));
const pause = page.getByRole("button", { name: "Pause" }).first();
await pause.click();
console.log("pause pressed", await page.getByRole("button", { name: "Play" }).first().getAttribute("aria-pressed"));
await page.screenshot({ path: path.join(dir, "tab-local-1440.png") });
await browser.close();

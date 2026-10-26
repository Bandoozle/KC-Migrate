import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3001";
const outDir = path.resolve("tmp-audit/hero-system");
const pages = [
  ["golf", "/services/golf-marketing/"],
  ["dental", "/services/dental-marketing/"],
  ["hvac", "/services/hvac-marketing/"],
  ["social", "/services/social-media-marketing/"],
];
const widths = [390, 768, 1440, 1920];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const report = [];

async function settle(page) {
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += 800) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
}

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });
  for (const [name, route] of pages) {
    const page = await context.newPage();
    const response = await page.goto(`${base}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await page.locator("h1").first().waitFor({ timeout: 30000 });
    await settle(page);
    await page.screenshot({
      path: path.join(outDir, `${name}-${width}.png`),
      fullPage: true,
    });
    const hero = page.locator("h1").first().locator("xpath=ancestor::section[1]");
    const box = await hero.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(outDir, `${name}-hero-${width}.png`),
        clip: { x: 0, y: 0, width, height: Math.min(900, Math.ceil(box.y + box.height + 8)) },
      });
    }
    const metrics = await page.evaluate(() => {
      const heroEl = document.querySelector("h1")?.closest("section");
      const heroBox = heroEl?.getBoundingClientRect();
      const images = [...document.querySelectorAll("img")].map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt,
        w: img.naturalWidth,
        h: img.naturalHeight,
      }));
      const docWidth = document.documentElement.scrollWidth;
      return {
        statusNote: document.title,
        h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() || "",
        h1Count: document.querySelectorAll("h1").length,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
        jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
        iframes: [...document.querySelectorAll("iframe")].map((frame) => frame.src),
        heroHeight: heroBox ? Math.round(heroBox.height) : null,
        heroTop: heroBox ? Math.round(heroBox.top + window.scrollY) : null,
        scrollWidth: docWidth,
        clientWidth: document.documentElement.clientWidth,
        overflow: docWidth - document.documentElement.clientWidth,
        hvacImages: images.filter((img) => /hvac/i.test(img.src)).map((img) => img.src),
        brokenImages: images.filter((img) => img.w === 0).map((img) => img.src),
        cta: [...document.querySelectorAll("h2")].map((node) => node.textContent?.trim()).filter((text) => /ready/i.test(text || "")),
      };
    });
    report.push({ name, width, status: response?.status(), heroBox: box, ...metrics });
    await page.close();
  }
  await context.close();
}

await browser.close();
await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.map(({ name, width, status, h1, h1Count, heroHeight, overflow, iframes, hvacImages, brokenImages, cta, canonical, jsonLd }) => ({
  name, width, status, h1, h1Count, heroHeight, overflow, iframes, hvacImages: hvacImages.length, brokenImages: brokenImages.length, cta, canonical, jsonLd,
})), null, 2));

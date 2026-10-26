import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("tmp-audit/direction");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

async function shoot(url, name) {
  const notes = [];
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(1500);
      const shots = [0, 900, 1800, 2700];
      for (const top of shots) {
        await page.evaluate((y) => window.scrollTo(0, y), top);
        await page.waitForTimeout(400);
        const file = `${name}-${width}-${top}.png`;
        await page.screenshot({ path: path.join(outDir, file) });
        notes.push(file);
      }
    } catch (error) {
      notes.push(`${name}-${width} ERROR ${error.message}`);
    }
    await page.close();
  }
  return notes;
}

const amplitude = [];
amplitude.push(...(await shoot("https://amplitude.com/headless", "headless")));
amplitude.push(...(await shoot("https://amplitude.com/wave?siteLocation=nav", "wave")));

const local = await browser.newPage();
const pages = {};
for (const route of [
  "/services/golf-marketing/",
  "/services/dental-marketing/",
  "/services/hvac-marketing/",
  "/services/website-development/",
  "/services/creative/",
  "/services/corporate-branding/",
  "/services/outdoor-advertising/",
  "/services/digital-marketing/",
  "/services/social-media-marketing/",
  "/services/email-marketing/",
  "/services/search-engine-optimization/",
  "/services/television-advertising/",
  "/services/radio-advertising/",
  "/services/digital-connected-tv/",
  "/services/business-development/",
  "/services/hvac-marketing/hvac-lead-generation/",
]) {
  await local.goto(`http://127.0.0.1:3001${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await local.waitForTimeout(400);
  pages[route] = await local.evaluate(() => {
    const main = document.querySelector("main");
    const headings = [...document.querySelectorAll("main h1, main h2, main h3")].map((node) => ({
      tag: node.tagName,
      text: node.textContent?.replace(/\s+/g, " ").trim().slice(0, 140),
    }));
    const images = [...document.querySelectorAll("main img")].slice(0, 12).map((img) => ({
      alt: img.getAttribute("alt")?.slice(0, 80) || "",
      src: (img.getAttribute("src") || "").slice(0, 160),
    }));
    return {
      h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
      sections: main ? main.children.length : 0,
      headings,
      images,
    };
  });
}

await writeFile(path.join(outDir, "pages.json"), JSON.stringify({ amplitude, pages }, null, 2));
console.log(JSON.stringify({ amplitude, routes: Object.keys(pages).length }, null, 2));
await browser.close();

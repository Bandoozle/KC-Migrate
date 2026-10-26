import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.env.HERO_BASE || "http://127.0.0.1:3011";
const outDir = path.resolve("tmp-audit/hero-after");

const pages = [
  ["social", "/services/social-media-marketing/"],
  ["television", "/services/television-advertising/"],
  ["radio", "/services/radio-advertising/"],
  ["outdoor", "/services/outdoor-advertising/"],
  ["connected-tv", "/services/digital-connected-tv/"],
  ["seo", "/services/search-engine-optimization/"],
  ["creative", "/services/creative/"],
  ["branding", "/services/corporate-branding/"],
  ["business", "/services/business-development/"],
  ["events", "/corporate-events/"],
  ["services", "/services/"],
  ["programs", "/marketing-programs/"],
  ["results", "/marketing-results/"],
  ["articles", "/feature-articles/"],
  ["contact", "/contact/"],
  ["billboards", "/services/outdoor-advertising/billboard-dimensions/"],
  ["thanks", "/thanks/"],
  ["payments", "/online-payments/"],
  ["sitemap", "/site-map/"],
  ["home", "/"],
  ["article", "/travel-marketing-canada/"],
  ["comfortmaker", "/comfortmaker/"],
];

const widths = [390, 768, 1440, 1920];

function num(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 10) / 10 : value;
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const report = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });
  for (const [name, route] of pages) {
    const page = await context.newPage();
    const response = await page.goto(`${base}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.locator("h1").first().waitFor({ timeout: 20000 });
    await page.waitForTimeout(250);
    const sectionHero = page.locator("h1").first().locator("xpath=ancestor::section[1]");
    const hero = (await sectionHero.count())
      ? sectionHero
      : page.locator("h1").first().locator("xpath=ancestor::*[self::header or self::main][1]");
    const box = await hero.boundingBox();
    const metrics = await hero.evaluate((section) => {
      const title = section.querySelector("h1");
      const secondary = title?.querySelector("span:last-child");
      const eyebrow = section.querySelector("p");
      const primary = section.querySelector("a");
      const cs = (el) => (el ? getComputedStyle(el) : null);
      const titleCs = cs(title);
      const sectionCs = getComputedStyle(section);
      const overlay = section.querySelector("div");
      return {
        h1: title?.textContent?.replace(/\s+/g, " ").trim() || "",
        h1Count: document.querySelectorAll("h1").length,
        fontSize: titleCs?.fontSize || "",
        fontFamily: titleCs?.fontFamily || "",
        secondaryColor: secondary ? getComputedStyle(secondary).color : "",
        minHeight: sectionCs.minHeight,
        height: sectionCs.height,
        overlayBg: overlay ? getComputedStyle(overlay).backgroundImage : "",
        buttonRadius: primary ? getComputedStyle(primary).borderRadius : "",
        buttonBg: primary ? getComputedStyle(primary).backgroundColor : "",
      };
    });
    const file = path.join(outDir, `${name}-${width}.png`);
    if (box) {
      await page.screenshot({
        path: file,
        clip: {
          x: 0,
          y: Math.max(0, box.y),
          width,
          height: Math.min(box.height, 900),
        },
      });
    } else {
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width, height: 640 } });
    }
    report.push({
      name,
      route,
      width,
      status: response?.status() || 0,
      heroHeight: box ? Math.round(box.height) : 0,
      fontSize: num(metrics.fontSize),
      h1: metrics.h1,
      h1Count: metrics.h1Count,
      secondaryColor: metrics.secondaryColor,
      buttonRadius: metrics.buttonRadius,
      buttonBg: metrics.buttonBg,
      minHeight: metrics.minHeight,
    });
    await page.close();
  }
  await context.close();
}

await browser.close();
const { writeFile } = await import("node:fs/promises");
await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));

const social = Object.fromEntries(
  report.filter((row) => row.name === "social").map((row) => [row.width, row]),
);
const mismatches = report
  .filter((row) => row.name === "television")
  .map((row) => {
    const ref = social[row.width];
    return {
      width: row.width,
      font: row.fontSize === ref.fontSize,
      height: Math.abs(row.heroHeight - ref.heroHeight) <= 8,
      radius: row.buttonRadius === ref.buttonRadius,
      button: row.buttonBg === ref.buttonBg,
      color: row.secondaryColor === ref.secondaryColor,
      tvHeight: row.heroHeight,
      socialHeight: ref.heroHeight,
      tvFont: row.fontSize,
      socialFont: ref.fontSize,
      h1: row.h1,
    };
  });

console.log(JSON.stringify({ mismatches, pages: report.filter((row) => row.width === 1440) }, null, 2));

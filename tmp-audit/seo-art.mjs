import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = "tmp-audit/seo-art";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const widths = [390, 768, 1440, 1920];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(async () => {
    const images = [...document.images];
    await Promise.all(
      images.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            }),
      ),
    );
  });
  await page.waitForTimeout(400);
}

function auditScript() {
  const hero = document.querySelector("h1");
  const heroSection = hero?.closest("section");
  const heroBox = hero?.getBoundingClientRect();
  const sectionBox = heroSection?.getBoundingClientRect();
  const titleLines = hero
    ? [...hero.querySelectorAll("span")].map((span) => {
        const box = span.getBoundingClientRect();
        return {
          text: span.textContent?.trim(),
          height: Math.round(box.height),
          top: Math.round(box.top),
          bottom: Math.round(box.bottom),
          overflow: span.scrollWidth > span.clientWidth + 1,
        };
      })
    : [];
  const sections = [...document.querySelectorAll("main section, article section")].map((section) => {
    const box = section.getBoundingClientRect();
    const heading = section.querySelector("h1, h2, h3");
    return {
      heading: heading?.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) || "",
      height: Math.round(box.height),
      top: Math.round(box.top + window.scrollY),
    };
  });
  const images = [...document.images].map((img) => ({
    alt: img.alt.slice(0, 60),
    natural: `${img.naturalWidth}x${img.naturalHeight}`,
    rendered: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
    upscaled: img.naturalWidth > 0 && img.getBoundingClientRect().width > img.naturalWidth + 2,
  }));
  return {
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    heroClipped: Boolean(
      heroBox &&
        sectionBox &&
        (heroBox.top < sectionBox.top - 1 || heroBox.bottom > sectionBox.bottom + 1),
    ),
    heroHeight: sectionBox ? Math.round(sectionBox.height) : 0,
    titleLines,
    sections,
    images,
  };
}

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await settle(page);
  await page.waitForFunction(
    (expected) => {
      const hero = document.querySelector("h1");
      const img = document.querySelector("h1")?.closest("section")?.querySelector("img");
      if (!hero || !img) return false;
      const color = getComputedStyle(hero).color;
      const width = img.getBoundingClientRect().width;
      return color.startsWith("rgb(255") && width > expected * 0.8 && width < expected + 8;
    },
    width,
    { timeout: 45000 },
  );
  const audit = await page.evaluate(auditScript);
  fs.writeFileSync(path.join(outDir, `audit-${width}.json`), JSON.stringify(audit, null, 2));
  await page.screenshot({ path: path.join(outDir, `hero-${width}.png`) });
  await page.screenshot({ path: path.join(outDir, `full-${width}.png`), fullPage: true });
  if (width === 1440 || width === 390) {
    const headings = page.locator("h2");
    const count = await headings.count();
    for (let i = 0; i < count; i += 1) {
      const heading = headings.nth(i);
      await heading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(outDir, `section-${width}-${i}.png`) });
    }
  }
  await page.close();
}

const golf = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await golf.goto("http://127.0.0.1:3001/services/golf-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await settle(golf);
await golf.screenshot({ path: path.join(outDir, "golf-hero-1440.png") });
const tv = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await tv.goto("http://127.0.0.1:3001/services/television-advertising/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await settle(tv);
await tv.screenshot({ path: path.join(outDir, "tv-hero-1440.png") });
await browser.close();
console.log("done");

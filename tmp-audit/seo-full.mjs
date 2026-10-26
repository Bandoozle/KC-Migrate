import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/seo-art";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("text=Analytics & Reporting").waitFor();
  await page.waitForFunction(
    (expected) => {
      const img = document.querySelector("h1")?.closest("section")?.querySelector("img");
      return img && img.naturalWidth > 0 && img.getBoundingClientRect().width > expected * 0.8;
    },
    width,
  );
  const audit = await page.evaluate(() => {
    const hero = document.querySelector("h1");
    const section = hero?.closest("section");
    const heroBox = hero?.getBoundingClientRect();
    const sectionBox = section?.getBoundingClientRect();
    const lines = [...(hero?.querySelectorAll("span") ?? [])].map((span) => {
      const box = span.getBoundingClientRect();
      return { text: span.textContent?.trim(), top: Math.round(box.top), bottom: Math.round(box.bottom) };
    });
    return {
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroHeight: sectionBox ? Math.round(sectionBox.height) : 0,
      heroClipped: Boolean(
        heroBox && sectionBox && (heroBox.top < sectionBox.top - 1 || heroBox.bottom > sectionBox.bottom + 1),
      ),
      lines,
    };
  });
  fs.writeFileSync(`${outDir}/final-audit-${width}.json`, JSON.stringify(audit, null, 2));
  await page.screenshot({ path: `${outDir}/full-${width}.png`, fullPage: true });
  console.log(width, JSON.stringify(audit));
  await page.close();
}

await browser.close();

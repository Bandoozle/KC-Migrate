import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const hero = document.querySelector("h1");
  const section = hero?.closest("section");
  const img = section?.querySelector("img");
  const sheets = [...document.styleSheets].map((sheet) => sheet.href).filter(Boolean);
  return {
    color: hero ? getComputedStyle(hero).color : null,
    display: hero ? getComputedStyle(hero).display : null,
    fontSize: hero ? getComputedStyle(hero).fontSize : null,
    sectionH: section ? Math.round(section.getBoundingClientRect().height) : null,
    img: img
      ? {
          w: Math.round(img.getBoundingClientRect().width),
          h: Math.round(img.getBoundingClientRect().height),
          natural: `${img.naturalWidth}x${img.naturalHeight}`,
        }
      : null,
    sheetCount: sheets.length,
    heroClass: section?.className,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "tmp-audit/seo-art/probe-1440.png" });
await browser.close();

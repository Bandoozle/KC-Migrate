import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("#tv-reach").waitFor();
const info = await page.evaluate(() => {
  const node = document.querySelector("#tv-reach");
  const rules = [];
  for (const sheet of document.styleSheets) {
    let cssRules;
    try { cssRules = sheet.cssRules; } catch { continue; }
    for (const rule of cssRules) {
      if (rule.selectorText && rule.selectorText.includes("reelTitle")) {
        rules.push({ sel: rule.selectorText, lh: rule.style.lineHeight, ls: rule.style.letterSpacing, fs: rule.style.fontSize, fw: rule.style.fontWeight });
      }
    }
  }
  return { className: node.className, rules };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();

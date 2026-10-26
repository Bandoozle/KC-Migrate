import { chromium } from "playwright";

const paths = (process.argv[2] || "/").split(",");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
for (const path of paths) {
  await page.goto(`http://localhost:3001${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
  const data = await page.evaluate(() => {
    const h1 = document.querySelector("h1")?.textContent.trim().replace(/\s+/g, " ");
    const items = [...document.querySelectorAll('[class*="eyebrow"], [class*="kicker"], [class*="Kicker"], [class*="Eyebrow"]')]
      .filter((el) => !el.closest("header, footer"))
      .map((el) => {
        const cs = getComputedStyle(el);
        return `${el.tagName.toLowerCase()} ${cs.textTransform} ${cs.fontSize} ls=${cs.letterSpacing} "${el.textContent.trim().replace(/\s+/g, " ").slice(0, 60)}" .${el.className.toString().slice(0, 70)}`;
      });
    return { h1, items };
  });
  console.log(`\n# ${path}  h1="${data.h1}"`);
  data.items.forEach((i) => console.log("  " + i));
}
await browser.close();

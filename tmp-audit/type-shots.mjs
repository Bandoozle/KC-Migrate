import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(url, width, name, selector) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  const el = page.locator(selector).first();
  await el.waitFor({ state: "visible" });
  const target = el.locator("xpath=ancestor::section[1]");
  await target.screenshot({ path: `tmp-audit/${name}.png` });
  const box = await page.evaluate((sel) => {
    const title = document.querySelector(sel);
    const aside = title?.parentElement?.querySelector("p");
    const widthOf = (node) => (node ? Math.round(node.getBoundingClientRect().width) : null);
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      title: widthOf(title),
      aside: widthOf(aside),
    };
  }, selector);
  console.log(name, box);
}

await shot("http://localhost:3001/services/television-advertising/", 1440, "type-tv-reel-1440", "#tv-reach");
await shot("http://localhost:3001/services/television-advertising/", 390, "type-tv-reel-390", "#tv-reach");
await shot("http://localhost:3001/", 1440, "type-home-1440", "#home-intro-title");

await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const [name, url] of [
  ["golf", "http://127.0.0.1:3001/services/golf-marketing/"],
  ["tv", "http://127.0.0.1:3001/services/television-advertising/"],
  ["dental", "http://127.0.0.1:3001/services/dental-marketing/"],
]) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("h1").waitFor({ timeout: 20000 });
  await page.waitForTimeout(600);
  const box = await page.locator("h1").boundingBox();
  const section = await page.locator("h1").evaluate((node) => {
    const hero = node.closest("section");
    const rect = hero?.getBoundingClientRect();
    const img = hero?.querySelector("img");
    return {
      className: hero?.className ?? "",
      height: rect ? Math.round(rect.height) : 0,
      img: img ? Math.round(img.getBoundingClientRect().width) : 0,
      color: getComputedStyle(node).color,
    };
  });
  console.log(name, JSON.stringify({ ...section, title: box }));
  await page.screenshot({ path: `tmp-audit/seo-art/${name}-hero-1440.png` });
}
await browser.close();

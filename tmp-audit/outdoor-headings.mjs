import { chromium } from "playwright";
const browser = await chromium.launch();
for (const [name, route] of [
  ["outdoor", "/services/outdoor-advertising/"],
  ["sizes", "/services/outdoor-advertising/billboard-dimensions/"],
]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  await page.goto("http://127.0.0.1:3001" + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
    h2: [...document.querySelectorAll("h2")].slice(0, 3).map((node) => node.textContent?.replace(/\s+/g, " ").trim()),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  console.log(name, JSON.stringify(info));
  await page.close();
}
await browser.close();

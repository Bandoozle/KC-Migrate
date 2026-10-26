import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("tmp-audit/tv-refine", { recursive: true });
const browser = await chromium.launch();
const url = "http://localhost:3001/services/television-advertising/";

for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  page.on("pageerror", (error) => console.log("PAGEERROR", width, error.message));
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("h1").waitFor({ timeout: 20000 });
  const heading = page.locator("section[class*='lineup'] h2").first();
  const metrics = await heading.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const parent = node.parentElement.getBoundingClientRect();
    return { heading: Math.round(box.width), parent: Math.round(parent.width), lines: Math.round(box.height / parseFloat(getComputedStyle(node).lineHeight)) };
  });
  console.log(width, metrics);
  await page.locator("section[class*='lineup']").screenshot({ path: `tmp-audit/tv-refine/lineup-compose-${width}.png` });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("h1").waitFor({ timeout: 20000 });
await page.getByRole("tab", { name: "Media Buying & Negotiation" }).click();
await page.locator("section[class*='lineup']").screenshot({ path: "tmp-audit/tv-refine/lineup-compose-buying.png" });
await page.getByRole("tab", { name: "Performance Tracking" }).click();
await page.locator("section[class*='lineup']").screenshot({ path: "tmp-audit/tv-refine/lineup-compose-performance.png" });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("overflow", overflow);
await browser.close();

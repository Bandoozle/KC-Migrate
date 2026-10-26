import { chromium } from "playwright";
import fs from "fs";

const out = "tmp-audit/tv-refine";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const url = "http://localhost:3001/services/television-advertising/";

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.on("pageerror", (error) => console.log("PAGEERROR", width, error.message));
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("h1").waitFor({ timeout: 20000 });
  await page.waitForTimeout(400);
  const heading = await page.locator("#tv-reach").evaluate((node) => {
    const style = getComputedStyle(node);
    const lineHeight = parseFloat(style.lineHeight);
    const height = node.getBoundingClientRect().height;
    return { lines: Math.round(height / lineHeight), width: Math.round(node.getBoundingClientRect().width) };
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(width, "heading", heading, "overflow", overflow);
  for (const name of ["reel", "lineup", "networks", "story"]) {
    const section = page.locator(`section[class*='${name}']`).first();
    await section.screenshot({ path: `${out}/${name}-${width}.png` });
  }
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("h1").waitFor({ timeout: 20000 });
await page.getByRole("tab", { name: /Media Buying/ }).click();
await page.locator("section[class*='lineup']").screenshot({ path: `${out}/lineup-buying.png` });
await page.getByRole("tab", { name: /Performance/ }).click();
await page.locator("section[class*='lineup']").screenshot({ path: `${out}/lineup-performance.png` });
await page.keyboard.press("ArrowLeft");
const selected = (await page.locator("[role='tab'][aria-selected='true']").innerText()).replace(/\s+/g, " ");
console.log("arrow", selected);
const frame = page.getByRole("button", { name: "Frame 4 of the television commercial" });
await frame.click();
console.log("frame4", await frame.getAttribute("aria-pressed"));
await page.locator("section[class*='story']").screenshot({ path: `${out}/story-frame4.png` });
await browser.close();

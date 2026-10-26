import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/email-page";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

async function shoot(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("h1").waitFor({ timeout: 20000 });
  await page.waitForFunction(() => {
    const images = [...document.querySelectorAll("main img")];
    return images.length > 0 && images.every((img) => img.complete && img.naturalWidth > 0);
  });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  const headings = await page.locator("main h2").allTextContents();
  await page.screenshot({ path: `${outDir}/email-${width}.png`, fullPage: true });
  console.log(width, "overflow", overflow, "h2", headings.map((item) => item.trim()));
  await page.close();
}

for (const width of [390, 768, 1440, 1920]) {
  await shoot(width);
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor();
await page.getByRole("tab", { name: "Audience Segmentation" }).click();
const segment = await page.locator("[role='tabpanel']").first().innerText();
console.log("SEGMENT", segment.replace(/\s+/g, " ").slice(0, 280));
await page.getByRole("tab", { name: "Performance Analytics" }).click();
const report = await page.locator("[role='tabpanel']").first().innerText();
console.log("REPORT", report.replace(/\s+/g, " ").slice(0, 280));
await page.keyboard.press("ArrowUp");
const selected = await page.locator("[role='tab'][aria-selected='true']").first().innerText();
console.log("AFTER ARROW", selected.replace(/\s+/g, " "));

const seasonal = page.getByRole("tab", { name: "Seasonal offer" });
await seasonal.scrollIntoViewIfNeeded();
await seasonal.click();
const alt = await page.locator("img[alt='Email Marketing']").count();
console.log("garden visible count", alt);
const journey = page.getByRole("button", { name: /Re-engagement workflows/ });
await journey.scrollIntoViewIfNeeded();
await journey.click();
console.log("journey pressed", await journey.getAttribute("aria-pressed"));
const reduced = await page.evaluate(
  () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
);
console.log("reduced", reduced);
await page.close();
await browser.close();

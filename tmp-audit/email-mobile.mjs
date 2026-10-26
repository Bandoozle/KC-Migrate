import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/email-page";
const browser = await chromium.launch();

for (const width of [390, 768]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("h1").waitFor();
  await page.waitForTimeout(600);
  const sections = page.locator("main > section");
  const count = await sections.count();
  for (let index = 0; index < count; index += 1) {
    await sections.nth(index).screenshot({ path: `${outDir}/w${width}-${index}.png` });
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  console.log(width, "sections", count, "overflow", overflow);
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor();
await page.waitForTimeout(1000);
const tab = page.getByRole("tab", { name: "Automation Workflows" });
const box = await tab.boundingBox();
await page.mouse.click(box.x + 40, box.y + 12);
await page.waitForTimeout(400);
const selected = await page.locator("[role='tab'][aria-selected='true']").first().innerText();
const panel = await page.locator("[role='tabpanel']").first().innerText();
console.log("MOUSE", selected.replace(/\s+/g, " "));
console.log("PANEL", panel.replace(/\s+/g, " ").slice(0, 240));
const sizes = await page.evaluate(() =>
  [...document.querySelectorAll("main img")].map((img) => ({
    alt: img.alt.slice(0, 40),
    natural: `${img.naturalWidth}x${img.naturalHeight}`,
    rendered: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
  })),
);
console.log(sizes);
await browser.close();

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const local = "http://127.0.0.1:3010";
const pages = [
  "/",
  "/contact/",
  "/corporate-events/",
  "/services/outdoor-advertising/",
  "/services/website-development/",
];
const widths = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1100 },
];
const out = path.resolve("tmp-audit/visual-stab");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const consoleErrors = [];

for (const pagePath of pages) {
  for (const viewport of widths) {
    const slug = pagePath === "/" ? "home" : pagePath.replace(/\//g, "_").replace(/^_|_$/g, "");
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(`${pagePath} ${viewport.name}: ${message.text()}`);
    });
    page.on("pageerror", (error) => {
      consoleErrors.push(`${pagePath} ${viewport.name}: ${error.message}`);
    });
    const response = await page.goto(`${local}${pagePath}`, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(out, `${slug}-${viewport.name}.png`), fullPage: false });
    console.log(pagePath, viewport.name, response?.status());
    await context.close();
  }
}

await browser.close();
const unique = [...new Set(consoleErrors)];
fs.writeFileSync(path.join(out, "console.txt"), unique.join("\n"));
console.log("console errors", consoleErrors.length, "unique", unique.length);
for (const line of unique) console.log(line.slice(0, 240));

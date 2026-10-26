import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const local = "http://127.0.0.1:3010";
const live = "https://www.kosick.com";
const pages = [
  "/",
  "/contact/",
  "/services/",
  "/services/hvac-marketing/",
  "/services/dental-marketing/",
  "/services/digital-marketing/",
  "/marketing-programs/",
  "/feature-articles/",
  "/travel-marketing-canada/",
];
const widths = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1100 },
];

const out = path.resolve("tmp-audit/visual");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const consoleErrors = [];

for (const pagePath of pages) {
  for (const viewport of widths) {
    const slug = pagePath === "/" ? "home" : pagePath.replace(/\//g, "_").replace(/^_|_$/g, "");
    for (const [label, origin] of [
      ["next", local],
      ["wp", live],
    ]) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => {
        consoleErrors.push({ page: pagePath, viewport: viewport.name, label, message: error.message });
      });
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push({ page: pagePath, viewport: viewport.name, label, message: msg.text() });
        }
      });
      const response = await page.goto(`${origin}${pagePath}`, {
        waitUntil: "load",
        timeout: 45000,
      });
      await page.waitForTimeout(800);
      const file = path.join(out, `${slug}-${viewport.name}-${label}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(label, pagePath, viewport.name, response?.status(), file);
      await context.close();
    }
  }
}

fs.writeFileSync(path.join(out, "console-errors.json"), JSON.stringify(consoleErrors, null, 2));
await browser.close();
console.log("errors", consoleErrors.length);

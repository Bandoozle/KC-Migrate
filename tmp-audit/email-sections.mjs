import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/email-page";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (error) => console.log("PAGEERROR", error.message));
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE", msg.text());
});
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor();
await page.waitForTimeout(1200);
const headings = await page.locator("main h2").allTextContents();
console.log(headings.map((item) => item.trim()));

const tab = page.getByRole("tab", { name: "Audience Segmentation" });
await tab.click();
await page.waitForTimeout(300);
console.log("selected", (await page.locator("[role='tab'][aria-selected='true']").first().innerText()).replace(/\s+/g, " "));
console.log("panel", (await page.locator("[role='tabpanel']").first().innerText()).replace(/\s+/g, " ").slice(0, 220));

const sections = page.locator("main > section, main > div");
const count = await sections.count();
console.log("sections", count);
for (let index = 0; index < count; index += 1) {
  const section = sections.nth(index);
  const box = await section.boundingBox();
  if (!box || box.height < 80) continue;
  await section.screenshot({ path: `${outDir}/section-${index}.png` });
  console.log("shot", index, Math.round(box.width), Math.round(box.height));
}
await browser.close();

import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/tv-page";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (error) => console.log("PAGEERROR", error.message));
await page.goto("http://localhost:3001/services/television-advertising/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor({ timeout: 20000 });
await page.waitForTimeout(800);
const headings = await page.locator("main h2").allTextContents();
console.log(headings.map((item) => item.trim()));
const video = page.getByRole("figure", { name: /Compelling TV commercial/ }).locator("video");
console.log("video", await video.count(), await video.getAttribute("src"), await video.getAttribute("poster"));
const controls = await video.evaluate((node) => node.hasAttribute("controls"));
console.log("controls", controls);

const tab = page.getByRole("tab", { name: "Media Buying & Negotiation" });
await tab.scrollIntoViewIfNeeded();
await tab.click();
console.log("panel", (await page.locator("[role='tabpanel']").innerText()).replace(/\s+/g, " ").slice(0, 220));
await page.keyboard.press("ArrowRight");
console.log("arrow", (await page.locator("[role='tab'][aria-selected='true']").innerText()).replace(/\s+/g, " "));

const sections = page.locator("main > section");
const count = await sections.count();
for (let index = 0; index < Math.min(count, 6); index += 1) {
  await sections.nth(index).screenshot({ path: `${outDir}/section-${index}.png` });
}
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
console.log("sections", count, "overflow", overflow);
await browser.close();

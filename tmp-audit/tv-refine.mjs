import { chromium } from "playwright";
import fs from "fs";

const out = "tmp-audit/tv-refine";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const url = "http://localhost:3001/services/television-advertising/";

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (error) => console.log("PAGEERROR", error.message));
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("h1").waitFor({ timeout: 20000 });
await page.waitForTimeout(600);

const title = page.locator("#tv-reach");
const box = await title.boundingBox();
const lines = await title.evaluate((node) => {
  const style = getComputedStyle(node);
  const lineHeight = parseFloat(style.lineHeight);
  return { text: node.textContent, height: node.getBoundingClientRect().height, lineHeight, width: node.getBoundingClientRect().width };
});
console.log("heading", lines);

const sections = ["reel", "lineup", "networks", "story"];
for (const name of sections) {
  const section = page.locator(`section[class*='${name}']`);
  console.log(name, await section.count());
  if (await section.count()) {
    await section.first().screenshot({ path: `${out}/${name}-1440.png` });
  }
}

await page.getByRole("tab", { name: /Connected TV/ }).click();
console.log("connected", (await page.locator("[role='tabpanel']").innerText()).replace(/\s+/g, " ").slice(0, 180));
await page.getByRole("tab", { name: /Performance/ }).click();
console.log("performance", (await page.locator("[role='tabpanel']").innerText()).replace(/\s+/g, " ").slice(0, 220));
await page.getByRole("button", { name: "Frame 3 of the television commercial" }).click();
const pressed = await page.getByRole("button", { name: "Frame 3 of the television commercial" }).getAttribute("aria-pressed");
console.log("frame3", pressed);
const partners = await page.locator("[class*='brandTile'] span").allTextContents();
console.log("partners", partners.length, partners.slice(0, 6).join(", "));
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("overflow", overflow);
await browser.close();

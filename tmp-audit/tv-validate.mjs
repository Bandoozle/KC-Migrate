import { chromium } from "playwright";
import fs from "fs";

const outDir = "tmp-audit/tv-page";
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const url = "http://localhost:3001/services/television-advertising/";

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.on("pageerror", (error) => console.log("PAGEERROR", width, error.message));
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("h1").waitFor({ timeout: 20000 });
  await page.waitForTimeout(700);
  const metrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelectorAll("main h1, h1").length,
  }));
  console.log(width, metrics);
  await page.screenshot({ path: `${outDir}/full-${width}.png`, fullPage: true });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (error) => console.log("PAGEERROR", error.message));
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("h1").waitFor({ timeout: 20000 });
await page.waitForTimeout(500);

const heading = (await page.locator("main h2").first().innerText()).replace(/\s+/g, " ");
console.log("reach", heading);

const names = await page.locator(".networkList span, [class*='networkList'] span").allTextContents();
const partnerText = names.map((name) => name.trim()).filter(Boolean);
console.log("partners", partnerText.length, partnerText.slice(0, 8).join(" | "));
console.log("long partner", partnerText.some((name) => name.length > 40));

const connected = page.getByRole("tab", { name: "Connected TV & Streaming" });
await connected.click();
console.log("connected", (await page.locator("[role='tabpanel']").innerText()).replace(/\s+/g, " ").slice(0, 240));
await page.keyboard.press("ArrowRight");
const selected = (await page.locator("[role='tab'][aria-selected='true']").innerText()).replace(/\s+/g, " ");
console.log("selected", selected);
console.log("buying", (await page.locator("[role='tabpanel']").innerText()).replace(/\s+/g, " ").slice(0, 240));

const production = page.getByRole("button", { name: "Full production" });
await production.click();
console.log("pressed", await production.getAttribute("aria-pressed"));

const video = page.getByRole("figure", { name: /Compelling TV commercial/ }).locator("video");
await video.evaluate((node) => node.play());
await page.waitForTimeout(1200);
const time = await video.evaluate((node) => ({
  currentTime: node.currentTime,
  duration: node.duration,
  paused: node.paused,
  poster: node.getAttribute("poster"),
  controls: node.hasAttribute("controls"),
}));
console.log("video", time);

const links = await page.locator("main a").evaluateAll((nodes) =>
  nodes.map((node) => ({ text: node.textContent?.replace(/\s+/g, " ").trim(), href: node.getAttribute("href") })),
);
console.log(links.filter((link) => /contact|tel:/i.test(`${link.href} ${link.text}`)));

const faqs = await page.locator("details, [class*='faq'] button, [class*='Faq'] button").count();
console.log("faq controls", faqs);

await page.locator("[class*='networkList']").screenshot({ path: `${outDir}/networks.png` });
await page.getByRole("tab", { name: "Linear TV Campaigns" }).click();
await page.locator("[role='tablist']").screenshot({ path: `${outDir}/tuner.png` });
await browser.close();

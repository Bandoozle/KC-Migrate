import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (error) => console.log("PAGEERROR", error.message));
await page.goto("http://localhost:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor();
await page.waitForTimeout(1200);
const tab = page.getByRole("tab", { name: "Audience Segmentation" });
await tab.scrollIntoViewIfNeeded();
await tab.click();
await page.waitForTimeout(300);
const selected = await page.locator("[role='tab'][aria-selected='true']").allInnerTexts();
console.log(selected.map((item) => item.replace(/\s+/g, " ")));
const panel = await page.locator("#" + (await tab.getAttribute("aria-controls"))).innerText();
console.log(panel.replace(/\s+/g, " ").slice(0, 300));
await page.keyboard.press("ArrowDown");
const after = await page.locator("[role='tab'][aria-selected='true']").first().innerText();
console.log("arrow", after.replace(/\s+/g, " "));
const seasonal = page.getByRole("tab", { name: "Seasonal offer" });
await seasonal.click();
const activeAlt = await page.locator(".frame img, [class*='frameImageActive']").first().getAttribute("alt").catch(() => "none");
console.log("campaign alt", activeAlt);
const step = page.getByRole("button", { name: /Abandoned cart/ });
await step.click();
console.log("journey", await step.getAttribute("aria-pressed"));
await browser.close();

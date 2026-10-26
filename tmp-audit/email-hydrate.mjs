import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (error) => console.log("PAGEERROR", error.message));
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor();
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const el = document.querySelector("[role='tab']");
  const keys = el ? Object.keys(el).filter((key) => key.startsWith("__react")) : [];
  return { keys, scripts: document.querySelectorAll("script[src]").length };
});
console.log(info);
const tab = page.getByRole("tab", { name: "Audience Segmentation" });
await tab.dispatchEvent("click");
await page.waitForTimeout(200);
console.log("after dispatch", (await page.locator("[role='tab'][aria-selected='true']").first().innerText()).replace(/\s+/g, " "));
await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const messages = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") messages.push(`${msg.type()}: ${msg.text()}`);
});
page.on("pageerror", (err) => messages.push(`pageerror: ${err.message}`));
await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
const badge = await page.locator("text=Issue").count();
console.log("issue badges", badge);
console.log(messages.slice(0, 20).join("\n") || "no console errors");
await browser.close();

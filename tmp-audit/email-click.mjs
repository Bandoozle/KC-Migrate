import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") errors.push(msg.type() + " " + msg.text());
});
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "networkidle",
  timeout: 20000,
}).catch((error) => console.log("goto", error.message.split("\n")[0]));
await page.locator("h1").waitFor();
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const el = document.querySelectorAll("[role='tab']")[1];
  el.click();
  return {
    names: Object.getOwnPropertyNames(el).slice(0, 12),
    selected: document.querySelector("[aria-selected='true']")?.textContent?.replace(/\s+/g, " "),
  };
});
console.log(info);
console.log(errors.slice(0, 8));
await browser.close();

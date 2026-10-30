import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text().slice(0, 400));
});
const res = await page.goto("http://localhost:3000/services/hvac-marketing/hvac-lead-generation/", { waitUntil: "domcontentloaded", timeout: 90000 });
console.log("status", res?.status());
console.log(errors.join("\n---\n").slice(0, 2000));
await browser.close();

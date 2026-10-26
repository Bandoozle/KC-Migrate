import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor({ timeout: 20000 });
const text = await page.locator("main").innerText();
fs.writeFileSync("tmp-audit/email-copy.txt", text);
console.log(text);
await browser.close();

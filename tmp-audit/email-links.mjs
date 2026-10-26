import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor();
const links = await page.evaluate(() =>
  [...document.querySelectorAll("main a")].map((a) => ({
    text: a.textContent?.replace(/\s+/g, " ").trim(),
    href: a.getAttribute("href"),
  })),
);
console.log(JSON.stringify(links, null, 2));
await browser.close();

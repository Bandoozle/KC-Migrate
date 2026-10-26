import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const failed = [];
page.on("requestfailed", (request) => failed.push(request.url() + " " + request.failure()?.errorText));
page.on("response", (response) => {
  if (response.status() >= 400 && response.url().includes("_next")) failed.push(response.status() + " " + response.url());
});
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor();
await page.waitForTimeout(1500);
const scripts = await page.evaluate(() =>
  [...document.scripts]
    .map((script) => script.src)
    .filter((src) => src.includes("email") || src.includes("Email") || src.includes("chunks")),
);
console.log("scripts", scripts);
console.log("failed", failed.slice(0, 20));
const html = await page.content();
console.log("client marker", html.includes("EmailCapabilityStudio") || html.includes("email-marketing"));
await browser.close();

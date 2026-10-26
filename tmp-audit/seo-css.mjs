import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const failed = [];
page.on("response", (response) => {
  const url = response.url();
  if (url.includes(".css") || response.status() >= 400) {
    failed.push(`${response.status()} ${url.slice(0, 180)}`);
  }
});
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(1000);
const html = await page.content();
const links = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]);
console.log("LINKS");
for (const link of links) console.log(link);
console.log("RESPONSES");
for (const line of failed) console.log(line);
console.log("class sample", html.includes("HeroBanner") || html.includes("hero"));
await browser.close();

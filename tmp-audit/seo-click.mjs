import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const failed = [];
page.on("response", (res) => {
  if (res.status() >= 400) failed.push(`${res.status()} ${res.url().slice(0, 140)}`);
});
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const el = document.getElementById("seo-capability-3");
  return {
    keys: Object.keys(el).filter((key) => key.startsWith("__react") || key.startsWith("__")).slice(0, 8),
    scripts: [...document.scripts].map((script) => script.src).filter(Boolean).slice(0, 8),
  };
});
console.log(JSON.stringify(info, null, 2));
console.log("failed", failed.slice(0, 12).join("\n"));
await browser.close();

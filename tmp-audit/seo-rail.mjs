import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/search-engine-optimization/", { waitUntil: "load", timeout: 90000 });
const info = await page.evaluate(() => {
  const sections = [...document.querySelectorAll("main section")].slice(0, 6);
  return sections.map((section) => {
    const before = getComputedStyle(section, "::before");
    return {
      border: before.borderLeftWidth + " " + before.borderLeftStyle,
      content: before.content,
    };
  });
});
console.log(JSON.stringify(info, null, 2));
await browser.close();

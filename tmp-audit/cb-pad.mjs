import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/corporate-branding/", { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(1200);
console.log(
  JSON.stringify(
    await page.evaluate(() => {
      const main = document.querySelector("main");
      return {
        block: getComputedStyle(main).getPropertyValue("--block"),
        sections: [...main.querySelectorAll(":scope > section")].map((s) => [
          s.className.slice(0, 50),
          getComputedStyle(s).paddingTop,
        ]),
      };
    }),
  ),
);
await browser.close();

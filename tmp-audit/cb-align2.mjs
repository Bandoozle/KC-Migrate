import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/corporate-branding/", { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(1500);
const out = [];
for (let i = 0; i < 6; i++) {
  await page.getByRole("tab").nth(i).click();
  await page.waitForTimeout(350);
  out.push(
    await page.evaluate(() => {
      const lead = document.querySelector("[class*='BrandProcess-module'][class*='lead']") ?? document.querySelector("[role=tablist]").parentElement;
      const panel = document.querySelector("[role=tabpanel]:not([hidden])");
      const mid = (r) => Math.round(r.top + r.height / 2);
      return [mid(lead.getBoundingClientRect()), mid(panel.getBoundingClientRect()), Math.round(panel.getBoundingClientRect().height)];
    }),
  );
}
console.log("mid left / mid right / panel height per step:", JSON.stringify(out));
await browser.close();

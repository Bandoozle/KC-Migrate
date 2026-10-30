import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/digital-connected-tv/", { waitUntil: "load", timeout: 90000 });
const info = await page.evaluate(() => {
  const ids = ["dv-formats", "dv-target", "dv-partners"];
  return ids.map((id) => {
    const title = document.getElementById(id);
    const label = title.previousElementSibling;
    const lead = title.parentElement.className.includes("centered")
      ? title.nextElementSibling
      : title.parentElement.nextElementSibling;
    const gap = (a, b) => Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom);
    return {
      id,
      labelToTitle: gap(label, title),
      titleToLead: gap(title, lead),
      titleMargin: getComputedStyle(title).marginBottom,
    };
  });
});
console.log(JSON.stringify(info, null, 2));
const block = page.locator("#dv-formats").locator("xpath=ancestor::div[contains(@class,'centered')][1]");
await block.screenshot({ path: "tmp-audit/shots/dv-intro-gap.png" });
await browser.close();

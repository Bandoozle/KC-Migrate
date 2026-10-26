import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded" });
const box = await page.evaluate(() => {
  const title = document.querySelector("#tv-reach");
  const aside = title?.nextElementSibling;
  const widthOf = (node) => (node ? Math.round(node.getBoundingClientRect().width) : null);
  return {
    title: widthOf(title),
    next: aside?.tagName,
    nextText: (aside?.textContent || "").trim().slice(0, 60),
    nextWidth: widthOf(aside),
  };
});
console.log(box);
await browser.close();

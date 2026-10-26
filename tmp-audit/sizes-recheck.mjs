import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto("http://127.0.0.1:3001/services/outdoor-advertising/billboard-dimensions/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(800);
const info = await page.evaluate(() => {
  const articles = [...document.querySelectorAll("main article")].map((article) => {
    const img = article.querySelector("img");
    const box = article.getBoundingClientRect();
    const image = img?.getBoundingClientRect();
    return {
      title: article.querySelector("h3")?.textContent?.trim(),
      cols: getComputedStyle(article).gridTemplateColumns,
      w: Math.round(box.width),
      h: Math.round(box.height),
      img: image ? { w: Math.round(image.width), h: Math.round(image.height), alt: img.getAttribute("alt") } : null,
    };
  });
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    articles,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "tmp-audit/outdoor-redesign/sizes-1440.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 900 });
await page.waitForTimeout(300);
await page.screenshot({ path: "tmp-audit/outdoor-redesign/sizes-390.png", fullPage: true });
await browser.close();

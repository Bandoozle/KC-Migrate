import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function measure(url, selector) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("h1").first().waitFor({ timeout: 20000 });
  const data = await page.locator(selector).first().evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      text: node.textContent.replace(/\s+/g, " ").trim().slice(0, 60),
      size: style.fontSize,
      weight: style.fontWeight,
      leading: style.lineHeight,
      tracking: style.letterSpacing,
      family: style.fontFamily.split(",")[0],
    };
  });
  console.log(selector, data);
}

await measure("http://localhost:3001/", "#home-intro-title");
await measure("http://localhost:3001/", "#home-solutions-title");
await measure("http://localhost:3001/", "h1");
await measure("http://localhost:3001/services/television-advertising/", "#tv-reach");
await measure("http://localhost:3001/services/television-advertising/", "section[class*='lineup'] h2");
await measure("http://localhost:3001/services/television-advertising/", "h1");
await measure("http://localhost:3001/services/email-marketing/", "h1");
await measure("http://localhost:3001/services/email-marketing/", "main h2");
await browser.close();

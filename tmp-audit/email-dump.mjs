import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3001/services/email-marketing/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor({ timeout: 20000 });
await page.waitForTimeout(800);
const data = await page.evaluate(() => {
  const main = document.querySelector("main");
  if (!main) return null;
  const sections = [...main.children].map((node, index) => {
    const headings = [...node.querySelectorAll("h1,h2,h3,h4")].map((h) => ({
      tag: h.tagName,
      text: h.textContent?.replace(/\s+/g, " ").trim(),
    }));
    const images = [...node.querySelectorAll("img")].map((img) => ({
      alt: img.alt,
      src: img.currentSrc || img.src,
      w: img.naturalWidth,
      h: img.naturalHeight,
    }));
    const text = node.textContent?.replace(/\s+/g, " ").trim().slice(0, 700);
    return { index, className: node.className?.toString().slice(0, 120), headings, images, text };
  });
  return sections;
});
console.log(JSON.stringify(data, null, 2));
await browser.close();

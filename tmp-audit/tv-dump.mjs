import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3001/services/television-advertising/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor({ timeout: 20000 });
const text = await page.locator("main").innerText();
fs.writeFileSync("tmp-audit/tv-copy.txt", text);
const media = await page.evaluate(() => {
  const images = [...document.querySelectorAll("main img")].map((img) => ({
    alt: img.alt,
    src: img.currentSrc || img.src,
    w: img.naturalWidth,
    h: img.naturalHeight,
  }));
  const frames = [...document.querySelectorAll("main iframe, main video, main source")].map((node) => ({
    tag: node.tagName,
    src: node.getAttribute("src"),
  }));
  const links = [...document.querySelectorAll("main a")].map((a) => ({
    text: a.textContent?.replace(/\s+/g, " ").trim(),
    href: a.getAttribute("href"),
  }));
  return { images, frames, links };
});
fs.writeFileSync("tmp-audit/tv-media.json", JSON.stringify(media, null, 2));
console.log(text);
console.log("---MEDIA---");
console.log(JSON.stringify(media, null, 2));
await browser.close();

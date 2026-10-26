import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/website-development/", { waitUntil: "networkidle", timeout: 120000 });
const info = await page.evaluate(() => {
  const sections = [...document.querySelectorAll("main > section")].map((section, index) => ({
    index,
    cls: section.className.slice(0, 100),
    headings: [...section.querySelectorAll("h2, h3")].map((el) => `${el.tagName} ${el.textContent.replace(/\s+/g, " ").trim()}`),
    text: section.innerText.replace(/\s+/g, " ").trim().slice(0, 500),
  }));
  const cards = [...document.querySelectorAll("main article, main [class*='card']")].map((card) => {
    const img = card.querySelector("img");
    const link = card.querySelector("a");
    let src = img?.currentSrc || img?.src || "";
    try { src = decodeURIComponent(new URL(src).searchParams.get("url") || src); } catch {}
    return {
      title: card.querySelector("h3, h4")?.textContent?.replace(/\s+/g, " ").trim(),
      body: [...card.querySelectorAll("p")].map((p) => p.textContent.replace(/\s+/g, " ").trim()).join(" | "),
      href: link?.getAttribute("href"),
      alt: img?.alt,
      src: src.split("/").slice(-3).join("/"),
      w: img?.naturalWidth,
      h: img?.naturalHeight,
    };
  });
  return { sections, cards };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();

import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch();
const page = await browser.newPage();
const out = {};
for (const route of ["/services/golf-marketing/", "/services/dental-marketing/"]) {
  await page.goto(`http://127.0.0.1:3001${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(500);
  out[route] = await page.evaluate(() => {
    const main = document.querySelector("main");
    const blocks = [...main.children].map((section, index) => ({
      index,
      tag: section.tagName,
      className: section.className?.toString().slice(0, 120),
      text: section.innerText.replace(/\n{3,}/g, "\n\n").trim().slice(0, 2500),
    }));
    const links = [...main.querySelectorAll("a")].map((a) => ({
      text: a.textContent.replace(/\s+/g, " ").trim().slice(0, 80),
      href: a.getAttribute("href"),
    }));
    return {
      title: document.title,
      canonical: document.querySelector("link[rel=canonical]")?.href,
      jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
      blocks,
      links,
    };
  });
}
await writeFile("tmp-audit/direction/golf-dental-copy.json", JSON.stringify(out, null, 2));
console.log("blocks", out["/services/golf-marketing/"].blocks.length, out["/services/dental-marketing/"].blocks.length);
await browser.close();

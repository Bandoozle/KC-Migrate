import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("tmp-audit/billboard-refine");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const notes = [];

for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1200 } });
  await page.goto("http://127.0.0.1:3001/services/outdoor-advertising/billboard-dimensions/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("h2", { hasText: "Billboard dimensions in Canada" }).waitFor();
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => {
    const articles = [...document.querySelectorAll("main article")].map((article) => {
      const img = article.querySelector("img");
      const body = article.querySelector("p:last-of-type");
      const dim = article.querySelector("p:nth-of-type(2)");
      const image = img?.getBoundingClientRect();
      const bodyStyle = body ? getComputedStyle(body) : null;
      return {
        title: article.querySelector("h3")?.textContent?.trim(),
        dim: dim?.textContent?.trim(),
        card: {
          w: Math.round(article.getBoundingClientRect().width),
          h: Math.round(article.getBoundingClientRect().height),
          radius: getComputedStyle(article).borderRadius,
        },
        img: image
          ? { w: Math.round(image.width), h: Math.round(image.height), alt: img.getAttribute("alt") }
          : null,
        bodySize: bodyStyle?.fontSize,
        bodyWidth: body ? Math.round(body.getBoundingClientRect().width) : null,
        dimSize: dim ? getComputedStyle(dim).fontSize : null,
      };
    });
    return {
      h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
      canonical: document.querySelector("link[rel='canonical']")?.getAttribute("href"),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      articles,
    };
  });
  await page.screenshot({ path: path.join(outDir, `sizes-${width}.png`), fullPage: true });
  notes.push({ width, ...info });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(notes, null, 2));

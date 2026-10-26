import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function roles(url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  return page.evaluate(() => {
    const read = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 64),
        size: cs.fontSize,
        weight: cs.fontWeight,
        leading: cs.lineHeight,
        tracking: cs.letterSpacing,
        transform: cs.textTransform,
      };
    };
    const all = [...document.querySelectorAll("h1, h2, h3, p, figcaption")];
    const heroEyebrow = all.find((el) => /advertising/i.test(el.textContent || "") && el.closest("header, [class*='hero'], [class*='Hero']"));
    const kickers = all
      .filter((el) => getComputedStyle(el).textTransform === "uppercase" && !el.closest("footer, nav"))
      .slice(0, 4)
      .map(read);
    const h2 = all.filter((el) => el.tagName === "H2").slice(0, 6).map(read);
    const h3 = all.filter((el) => el.tagName === "H3").slice(0, 3).map(read);
    const caption = read(document.querySelector("figcaption"));
    return {
      h1: read(document.querySelector("h1")),
      kickers,
      h2,
      h3,
      caption,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

for (const url of [
  "http://localhost:3001/services/television-advertising/",
  "http://localhost:3001/services/email-marketing/",
  "http://localhost:3001/marketing-results/",
]) {
  console.log("\n==", url);
  console.log(JSON.stringify(await roles(url), null, 2));
}

await browser.close();

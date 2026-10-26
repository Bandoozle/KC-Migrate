import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

function metrics(el) {
  const cs = getComputedStyle(el);
  return {
    text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 72),
    tag: el.tagName,
    size: cs.fontSize,
    weight: cs.fontWeight,
    leading: cs.lineHeight,
    tracking: cs.letterSpacing,
    family: cs.fontFamily.split(",")[0],
    transform: cs.textTransform,
  };
}

async function read(url, picks) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(600);
  return page.evaluate((selectors) => {
    const root = getComputedStyle(document.documentElement);
    const vars = [
      "--kosick-section-title-size",
      "--kosick-section-title-leading",
      "--kosick-section-title-tracking",
      "--kosick-section-title-weight",
      "--kosick-eyebrow-size",
      "--kosick-eyebrow-tracking",
      "--kosick-body-leading",
    ].map((name) => [name, root.getPropertyValue(name).trim()]);
    const sample = (el, selector) => {
      const cs = getComputedStyle(el);
      return {
        selector,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 72),
        size: cs.fontSize,
        weight: cs.fontWeight,
        leading: cs.lineHeight,
        tracking: cs.letterSpacing,
        family: cs.fontFamily.split(",")[0],
        transform: cs.textTransform,
      };
    };
    const found = selectors.flatMap((selector) => {
      const nodes = [...document.querySelectorAll(selector)].slice(0, 4);
      if (nodes.length === 0) return [{ selector, missing: true }];
      return nodes.map((el) => sample(el, selector));
    });
    const extras = [...document.querySelectorAll("p, figcaption, h3")]
      .filter((el) => getComputedStyle(el).textTransform === "uppercase")
      .slice(0, 2)
      .map((el) => sample(el, el.tagName.toLowerCase()));
    found.push(...extras);
    return { vars, found };
  }, picks);
}

const pages = [
  ["http://localhost:3001/", ["#home-intro-title"]],
  ["http://localhost:3001/services/television-advertising/", ["#tv-reach"]],
  ["http://localhost:3001/services/email-marketing/", ["h2"]],
  ["http://localhost:3001/services/search-engine-optimization/", ["#seo-report"]],
  ["http://localhost:3001/services/golf-marketing/", ["h2"]],
  ["http://localhost:3001/services/dental-marketing/", ["h2"]],
  ["http://localhost:3001/services/outdoor-advertising/", ["h2"]],
  ["http://localhost:3001/services/radio-advertising/", ["h2"]],
  ["http://localhost:3001/services/social-media-marketing/", ["h2"]],
  ["http://localhost:3001/services/website-development/", ["h2"]],
];

for (const [url, picks] of pages) {
  const result = await read(url, picks);
  console.log("\n==", url);
  if (url.includes("television")) console.log(result.vars);
  for (const row of result.found) console.log(row);
}

await page.setViewportSize({ width: 390, height: 844 });
for (const url of ["http://localhost:3001/", "http://localhost:3001/services/television-advertising/"]) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const narrow = await page.evaluate(() => {
    const title = document.querySelector("#home-intro-title, #tv-reach");
    const caption = document.querySelector("figcaption");
    const read = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { text: (el.textContent || "").trim().slice(0, 48), size: cs.fontSize, leading: cs.lineHeight, tracking: cs.letterSpacing };
    };
    return {
      title: read(title),
      caption: read(caption),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  console.log("\n== 390", url, narrow);
}

await browser.close();

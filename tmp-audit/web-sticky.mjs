import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
const info = await page.evaluate(() => {
  const stage = document.querySelector("[class*='stage']");
  const chain = [];
  let node = stage;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    chain.push({
      tag: node.tagName,
      id: node.id || "",
      className: String(node.className).slice(0, 120),
      position: style.position,
      overflow: style.overflow,
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      transform: style.transform,
      contain: style.contain,
      filter: style.filter,
      willChange: style.willChange,
    });
    node = node.parentElement;
  }
  const html = getComputedStyle(document.documentElement);
  return {
    chain,
    htmlOverflow: html.overflow,
    bodyOverflow: getComputedStyle(document.body).overflow,
    stageTop: getComputedStyle(stage).top,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();

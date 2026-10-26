import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await page.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});

async function at(progress) {
  await page.evaluate((value) => {
    const track = document.querySelector("[class*='track']");
    const stage = track.querySelector("[class*='stage']");
    const stick = track.offsetHeight - stage.offsetHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + (value / 7) * stick);
  }, progress);
  await page.waitForTimeout(250);
  return page.evaluate(() => {
    const layers = [...document.querySelectorAll("[class*='layer']")]
      .map((node) => ({
        host: node.querySelector("[class*='host']")?.textContent?.trim(),
        opacity: Number(getComputedStyle(node).opacity).toFixed(2),
      }))
      .filter((layer) => Number(layer.opacity) > 0.04);
    return {
      title: document.querySelector("[data-active='true'] h3")?.textContent?.trim(),
      href: document.querySelector("[data-active='true'] a")?.getAttribute("href"),
      stageTop: Math.round(document.querySelector("[class*='stage']").getBoundingClientRect().top),
      layers,
    };
  });
}

console.log("hold", JSON.stringify(await at(0.4)));
console.log("later", JSON.stringify(await at(4.2)));
console.log("end", JSON.stringify(await at(7)));
console.log("errors", errors);
await page.screenshot({ path: "tmp-audit/shots/web-scroll-1440-7.png" });
await browser.close();

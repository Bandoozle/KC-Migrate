import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await page.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});

async function at(progress, file) {
  const reading = await page.evaluate((value) => {
    const track = document.querySelector("[class*='track']");
    const stage = track.querySelector("[class*='stage']");
    const stick = track.offsetHeight - stage.offsetHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + (value / 7) * stick);
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const layers = [...document.querySelectorAll("[class*='layer']")]
          .map((node) => ({
            host: node.querySelector("[class*='host']")?.textContent?.trim(),
            opacity: Number(getComputedStyle(node).opacity).toFixed(2),
          }))
          .filter((layer) => Number(layer.opacity) > 0.04);
        resolve({
          title: document.querySelector("[data-active='true'] h3")?.textContent?.trim(),
          stageTop: Math.round(stage.getBoundingClientRect().top),
          layers,
        });
      });
    });
  }, progress);
  await page.waitForTimeout(150);
  await page.screenshot({ path: file });
  return reading;
}

console.log("hold", JSON.stringify(await at(0.4, "tmp-audit/shots/web-hold-1440.png")));
console.log("fade", JSON.stringify(await at(0.89, "tmp-audit/shots/web-fade-1440.png")));
console.log("skin", JSON.stringify(await at(3.15, "tmp-audit/shots/web-scroll-1440-3.png")));
console.log("errors", errors);
await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/television-advertising/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await page.addStyleTag({
  content: `[class*="megaPanel"]:not([hidden]) { animation-duration: 4s !important; animation-delay: 0s !important; }`,
});
await page.getByRole("button", { name: "Services", exact: true }).hover();
await page.waitForSelector("[class*='megaPanel']:not([hidden])");
const mid = await page.evaluate(() => {
  const panel = document.querySelector("[class*='megaPanel']:not([hidden])");
  const animation = panel.getAnimations().find((item) => item.animationName === "kosickMenuIn" || item.effect);
  const effect = panel.getAnimations()[0];
  if (effect) {
    effect.pause();
    const duration = effect.effect.getComputedTiming().duration;
    effect.currentTime = duration * 0.08;
  }
  const style = getComputedStyle(panel);
  const box = panel.getBoundingClientRect();
  return {
    name: panel.getAnimations().map((item) => item.animationName || item.constructor.name),
    clip: style.clipPath,
    transform: style.transform,
    opacity: style.opacity,
    top: Math.round(box.top),
    height: Math.round(box.height),
  };
});
await page.screenshot({ path: "tmp-audit/shots/mega-expand.png" });
console.log(JSON.stringify(mid, null, 2));
await browser.close();

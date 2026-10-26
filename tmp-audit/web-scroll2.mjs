import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto("http://localhost:3001/services/website-development/", { waitUntil: "networkidle", timeout: 120000 });
const heading = desktop.locator("#__next h2, main h2").filter({ hasText: "Our Latest Website Projects" });
await heading.scrollIntoViewIfNeeded();
await desktop.waitForTimeout(200);
await desktop.screenshot({ path: "tmp-audit/shots/web-heading-1440.png" });
await desktop.locator("[role='tab']").first().focus();
await desktop.keyboard.press("ArrowRight");
await desktop.waitForTimeout(600);
const afterKey = await desktop.locator("[role='tabpanel'] h3").evaluateAll((nodes) =>
  nodes.filter((node) => node.getClientRects().length).map((node) => node.textContent.trim()),
);
console.log("arrow from first", afterKey);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3001/services/website-development/", { waitUntil: "networkidle", timeout: 120000 });
const reel = mobile.getByLabel("Website projects");
await reel.scrollIntoViewIfNeeded();
await mobile.getByRole("button", { name: "Next website" }).click();
await mobile.waitForTimeout(500);
const slide = await mobile.evaluate(() => {
  const node = document.querySelector("[aria-label='Website projects']");
  const slides = [...node.querySelectorAll("[data-slide]")];
  const current = slides.reduce((best, item) =>
    Math.abs(item.offsetLeft - node.scrollLeft) < Math.abs(best.offsetLeft - node.scrollLeft) ? item : best,
  );
  return {
    title: current.querySelector("h3")?.textContent?.trim(),
    href: current.querySelector("a")?.getAttribute("href"),
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  };
});
await mobile.screenshot({ path: "tmp-audit/shots/web-mobile-390.png" });
console.log("mobile", JSON.stringify(slide));

const reduced = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const still = await reduced.newPage();
await still.goto("http://localhost:3001/services/website-development/", { waitUntil: "networkidle", timeout: 120000 });
console.log("reduced", await still.evaluate(() => {
  const track = document.querySelector("[class*='track']");
  const stage = document.querySelector("[class*='stage']");
  return { trackH: Math.round(track.getBoundingClientRect().height), stagePos: getComputedStyle(stage).position };
}));
await still.locator("[role='tab']").nth(2).click();
await still.waitForTimeout(200);
console.log("reduced pick", await still.locator("[role='tabpanel'] [data-active='true'] h3").innerText());
await browser.close();

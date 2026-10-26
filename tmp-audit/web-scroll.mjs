import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("tmp-audit/shots", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });

async function readStage(page) {
  return page.evaluate(() => {
    const title = document.querySelector("[class*='projectTitle']")?.textContent?.trim();
    const description = [...document.querySelectorAll("[class*='description']")]
      .find((node) => node.getClientRects().length)
      ?.textContent?.replace(/\s+/g, " ")
      .trim();
    const link = [...document.querySelectorAll("[class*='visit']")].find((node) => node.getClientRects().length);
    const stage = document.querySelector("[class*='stage']");
    const track = document.querySelector("[class*='track']");
    const img = [...document.querySelectorAll("[class*='viewport'] img")].find((node) => {
      const layer = node.closest("[class*='layer']");
      return layer && getComputedStyle(layer).opacity === "1";
    });
    return {
      title,
      description: description?.slice(0, 90),
      href: link?.getAttribute("href"),
      stageTop: stage ? Math.round(stage.getBoundingClientRect().top) : null,
      trackH: track ? Math.round(track.getBoundingClientRect().height) : null,
      img: img ? `${img.naturalWidth}x${img.naturalHeight}` : null,
    };
  });
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
desktop.on("pageerror", (error) => errors.push(String(error)));
await desktop.goto("http://localhost:3001/services/website-development/", { waitUntil: "networkidle", timeout: 120000 });
const track = desktop.locator("[class*='track']");
await track.scrollIntoViewIfNeeded();
const box = await track.boundingBox();
const trackTop = await desktop.evaluate(() => {
  const node = document.querySelector("[class*='track']");
  return node.getBoundingClientRect().top + window.scrollY;
});
const trackHeight = await desktop.evaluate(() => document.querySelector("[class*='track']").offsetHeight);
const steps = 8;
for (let index = 0; index < steps; index += 1) {
  const y = trackTop + ((trackHeight - 900) * index) / (steps - 1);
  await desktop.evaluate((top) => window.scrollTo(0, top), y);
  await desktop.waitForTimeout(180);
  const info = await readStage(desktop);
  if (index === 0 || index === 3 || index === 7) {
    await desktop.screenshot({ path: `tmp-audit/shots/web-scroll-1440-${index}.png` });
  }
  console.log("desk", index, JSON.stringify(info));
}

const selected = desktop.locator("[role='tab'][aria-selected='true']");
await selected.focus();
await desktop.keyboard.press("ArrowRight");
await desktop.waitForTimeout(500);
console.log("key", await readStage(desktop));

const hrefs = await desktop.locator("[class*='visit']").evaluateAll((nodes) => [
  ...new Set(nodes.map((node) => node.getAttribute("href")).filter(Boolean)),
]);
for (const href of hrefs) {
  try {
    const res = await fetch(href, { method: "GET", redirect: "follow" });
    console.log(res.status, href);
  } catch (error) {
    console.log("fail", href, error.message);
  }
}
console.log("errors", errors);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3001/services/website-development/", { waitUntil: "networkidle", timeout: 120000 });
const reel = mobile.locator("[class*='reel']");
await reel.scrollIntoViewIfNeeded();
const before = await mobile.locator("[data-slide] h3").first().textContent();
await mobile.locator("[class*='reelButton']").nth(1).click();
await mobile.waitForTimeout(400);
const after = await mobile.evaluate(() => {
  const reel = document.querySelector("[class*='reel']");
  const slides = [...reel.querySelectorAll("[data-slide]")];
  const left = reel.scrollLeft;
  const current = slides.reduce((best, slide) =>
    Math.abs(slide.offsetLeft - left) < Math.abs(best.offsetLeft - left) ? slide : best,
  );
  return { left, title: current.querySelector("h3")?.textContent?.trim(), overflow: document.documentElement.scrollWidth - window.innerWidth };
});
await mobile.screenshot({ path: "tmp-audit/shots/web-mobile-390.png" });
console.log("mobile", before?.trim(), "->", JSON.stringify(after));

const reduced = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const still = await reduced.newPage();
await still.goto("http://localhost:3001/services/website-development/", { waitUntil: "networkidle", timeout: 120000 });
const reducedInfo = await still.evaluate(() => {
  const track = document.querySelector("[class*='track']");
  const stage = document.querySelector("[class*='stage']");
  return {
    trackH: Math.round(track.getBoundingClientRect().height),
    stagePos: getComputedStyle(stage).position,
  };
});
console.log("reduced", JSON.stringify(reducedInfo));
await browser.close();
console.log("box", box && Math.round(box.height));

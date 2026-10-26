import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
desktop.on("pageerror", (error) => errors.push(String(error)));
await desktop.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await desktop.locator("h2", { hasText: "Our Latest Website Projects" }).scrollIntoViewIfNeeded();
await desktop.waitForTimeout(400);
await desktop.screenshot({ path: "tmp-audit/shots/web-arrival-1440.png" });

const arrival = await desktop.evaluate(() => {
  const heading = [...document.querySelectorAll("h2")].find((node) =>
    node.textContent.includes("Our Latest Website Projects"),
  );
  const frame = document.querySelector("[class*='front']");
  const headingBox = heading.getBoundingClientRect();
  const frameBox = frame.getBoundingClientRect();
  return {
    headingBottom: Math.round(headingBox.bottom),
    frameTop: Math.round(frameBox.top),
    gap: Math.round(frameBox.top - headingBox.bottom),
  };
});
console.log("arrival", JSON.stringify(arrival));

const sequence = await desktop.evaluate(async () => {
  const track = document.querySelector("[class*='track']");
  const stage = track.querySelector("[class*='stage']");
  const stick = track.offsetHeight - stage.offsetHeight;
  const top = track.getBoundingClientRect().top + window.scrollY;
  const read = () => {
    const panel = document.querySelector("[data-active='true']");
    const layer = [...document.querySelectorAll("[class*='layer']")].find(
      (node) => getComputedStyle(node).opacity === "1",
    );
    const img = layer?.querySelector("[class*='viewport'] img");
    const tabs = [...document.querySelectorAll("[role='tab']")];
    const tabTops = tabs.map((tab) => Math.round(tab.getBoundingClientRect().top));
    const title = panel?.querySelector("h3");
    const link = panel?.querySelector("a");
    const titleBox = title?.getBoundingClientRect();
    const linkBox = link?.getBoundingClientRect();
    return {
      title: title?.textContent?.trim(),
      href: link?.getAttribute("href") || null,
      description: panel?.querySelector("p")?.textContent?.trim() || null,
      host: layer?.querySelector("[class*='host']")?.textContent?.trim() || null,
      titleToLink: titleBox && linkBox ? Math.round(linkBox.top - titleBox.bottom) : null,
      tabRow: Math.max(...tabTops) - Math.min(...tabTops),
      stageTop: Math.round(stage.getBoundingClientRect().top),
      image: img
        ? { rendered: Math.round(img.getBoundingClientRect().width), natural: img.naturalWidth }
        : null,
      scrollY: Math.round(window.scrollY),
    };
  };
  const marks = [0, 0.14, 0.42, 0.71, 1];
  const frames = [];
  for (const mark of marks) {
    window.scrollTo(0, top + mark * stick);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    frames.push({ mark, ...read() });
  }
  return { stick: Math.round(stick), trackH: Math.round(track.offsetHeight), frames };
});
console.log("sequence", JSON.stringify(sequence, null, 2));

async function shotAt(mark, file) {
  await desktop.evaluate((fraction) => {
    const track = document.querySelector("[class*='track']");
    const stage = track.querySelector("[class*='stage']");
    const stick = track.offsetHeight - stage.offsetHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + fraction * stick);
  }, mark);
  await desktop.waitForTimeout(250);
  await desktop.screenshot({ path: file });
}
await shotAt(0, "tmp-audit/shots/web-scroll-1440-0.png");
await shotAt(3 / 7, "tmp-audit/shots/web-scroll-1440-3.png");
await shotAt(1, "tmp-audit/shots/web-scroll-1440-7.png");

await desktop.evaluate(() => {
  const track = document.querySelector("[class*='track']");
  const top = track.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top);
});
await desktop.waitForTimeout(200);
await desktop.locator("[role='tab']").first().focus();
await desktop.keyboard.press("ArrowRight");
await desktop.waitForTimeout(700);
const afterKey = await desktop.evaluate(() => ({
  selected: document.querySelector("[role='tab'][aria-selected='true']")?.getAttribute("aria-label"),
  title: document.querySelector("[data-active='true'] h3")?.textContent?.trim(),
  href: document.querySelector("[data-active='true'] a")?.getAttribute("href"),
}));
console.log("arrow", JSON.stringify(afterKey));
console.log("errors", errors);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
const reel = mobile.getByLabel("Website project slides");
await reel.scrollIntoViewIfNeeded();
await mobile.getByRole("button", { name: "Next website" }).click();
await mobile.waitForTimeout(600);
const slide = await mobile.evaluate(() => {
  const node = document.querySelector("[aria-label='Website project slides']");
  const slides = [...node.querySelectorAll("[data-slide]")];
  const current = slides.reduce((best, item) =>
    Math.abs(item.getBoundingClientRect().left) < Math.abs(best.getBoundingClientRect().left) ? item : best,
  );
  return {
    title: current.querySelector("h3")?.textContent?.trim(),
    href: current.querySelector("a")?.getAttribute("href"),
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    trackDisplay: getComputedStyle(document.querySelector("[class*='track']")).display,
  };
});
await mobile.screenshot({ path: "tmp-audit/shots/web-mobile-390.png" });
console.log("mobile", JSON.stringify(slide));

const reduced = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const still = await reduced.newPage();
await still.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
const reducedLayout = await still.evaluate(() => {
  const track = document.querySelector("[class*='track']");
  const stage = track.querySelector("[class*='stage']");
  const style = getComputedStyle(track);
  return {
    trackH: Math.round(track.getBoundingClientRect().height),
    stagePos: getComputedStyle(stage).position,
    padding: style.paddingBottom,
    viewport: window.innerHeight,
  };
});
console.log("reduced", JSON.stringify(reducedLayout));
await still.locator("h2", { hasText: "Our Latest Website Projects" }).scrollIntoViewIfNeeded();
await still.locator("[role='tab']").nth(2).click();
await still.waitForTimeout(200);
const beforeScroll = await still.locator("[data-active='true'] h3").innerText();
await still.evaluate(() => window.scrollBy(0, 500));
await still.waitForTimeout(200);
const afterScroll = await still.locator("[data-active='true'] h3").innerText();
console.log("reduced pick", beforeScroll, "after scroll", afterScroll);

await browser.close();

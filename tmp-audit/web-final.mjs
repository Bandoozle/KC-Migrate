import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });

const reduced = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const still = await reduced.newPage();
await still.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await still.evaluate(() => {
  const heading = [...document.querySelectorAll("h2")].find((node) =>
    node.textContent.includes("Our Latest Website Projects"),
  );
  window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - 88);
});
await still.locator("[role='tab']").nth(2).click({ force: true });
await still.waitForTimeout(200);
await still.screenshot({ path: "tmp-audit/shots/web-reduced-1440.png" });
console.log(
  "reduced",
  await still.evaluate(() => {
    const track = document.querySelector("[class*='track']");
    const stage = track.querySelector("[class*='stage']");
    return {
      title: document.querySelector("[data-active='true'] h3")?.textContent?.trim(),
      host: document.querySelector("[class*='host']")?.textContent?.trim(),
      trackH: Math.round(track.getBoundingClientRect().height),
      stagePos: getComputedStyle(stage).position,
      runway: document.querySelector("[class*='runway']")
        ? getComputedStyle(document.querySelector("[class*='runway']")).display
        : "missing",
    };
  }),
);

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await desktop.evaluate(() => {
  const track = document.querySelector("[class*='track']");
  const stage = track.querySelector("[class*='stage']");
  const stick = track.offsetHeight - stage.offsetHeight;
  const top = track.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top + (0.5 / 7) * stick);
});
await desktop.waitForTimeout(200);
const blend = await desktop.evaluate(() => {
  const layers = [...document.querySelectorAll("[class*='layer']")].map((node) => ({
    host: node.querySelector("[class*='host']")?.textContent?.trim(),
    opacity: Number(getComputedStyle(node).opacity).toFixed(2),
  }));
  const links = [...document.querySelectorAll("[class*='showcase'] a")].map((node) => ({
    href: node.getAttribute("href"),
    inert: Boolean(node.closest("[inert]")),
  }));
  return { layers: layers.filter((layer) => Number(layer.opacity) > 0.05), links };
});
await desktop.screenshot({ path: "tmp-audit/shots/web-crossfade-1440.png" });
console.log("blend", JSON.stringify(blend, null, 2));

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await mobile.evaluate(() => {
  const heading = [...document.querySelectorAll("h2")].find((node) =>
    node.textContent.includes("Our Latest Website Projects"),
  );
  window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - 64);
});
await mobile.waitForTimeout(200);
await mobile.screenshot({ path: "tmp-audit/shots/web-mobile-390.png" });
console.log(
  "mobile overflow",
  await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
);

await browser.close();

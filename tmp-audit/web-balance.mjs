import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await page.evaluate(() => {
  const track = document.querySelector("[class*='track']");
  const stage = track.querySelector("[class*='stage']");
  const stick = track.offsetHeight - stage.offsetHeight;
  const topOffset = Number.parseFloat(getComputedStyle(stage).top) || 0;
  const top = track.getBoundingClientRect().top + window.scrollY - topOffset;
  window.scrollTo(0, top + (2.2 / 7) * stick);
});
await page.waitForTimeout(400);
const measure = await page.evaluate(() => {
  const header = document.querySelector("header").getBoundingClientRect();
  const stage = document.querySelector("[class*='stage']").getBoundingClientRect();
  const heading = [...document.querySelectorAll("h2")].find((node) =>
    node.textContent.includes("Our Latest Website Projects"),
  ).getBoundingClientRect();
  return {
    title: document.querySelector("[data-active='true'] h3")?.textContent?.trim(),
    headerBottom: Math.round(header.bottom),
    stageTop: Math.round(stage.top),
    headingTop: Math.round(heading.top),
    stageBottom: Math.round(stage.bottom),
    gapAbove: Math.round(stage.top - header.bottom),
    gapBelow: Math.round(window.innerHeight - stage.bottom),
  };
});
await page.screenshot({ path: "tmp-audit/shots/web-balance-1440.png" });
console.log(JSON.stringify(measure));
await browser.close();

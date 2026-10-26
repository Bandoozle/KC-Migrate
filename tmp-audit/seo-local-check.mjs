import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("tmp-audit/seo-local");
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();

async function open(width, reduced = false) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.locator("h2", { hasText: "Local search engine optimization" }).waitFor();
  return page;
}

for (const width of [390, 768, 1440, 1920]) {
  const page = await open(width);
  const local = page.locator("section").filter({ has: page.locator("h2", { hasText: "Local search engine optimization" }) });
  await local.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await local.boundingBox();
  const metrics = await local.evaluate((node) => {
    const section = node.getBoundingClientRect();
    const empty = [...node.querySelectorAll("*")].filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.height > 240 && el.childElementCount === 0 && !(el.textContent || "").trim();
    }).length;
    return {
      height: Math.round(section.height),
      emptyBlocks: empty,
    };
  });
  console.log("seo", width, JSON.stringify(metrics), "overflow", await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  if (box) {
    await page.screenshot({
      path: path.join(dir, `local-${width}.png`),
      clip: {
        x: 0,
        y: Math.max(0, box.y),
        width,
        height: Math.min(900, box.height),
      },
    });
  }
  await page.screenshot({ path: path.join(dir, `full-${width}.png`), fullPage: true });
  await page.close();
}

const page = await open(1440);
const local = page.locator("section").filter({ has: page.locator("h2", { hasText: "Local search engine optimization" }) });
await local.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const before = await page.locator("#seo-market-panel").innerText();
await page.locator("#seo-market-1").click();
await page.waitForTimeout(400);
const afterClick = await page.locator("#seo-market-panel").innerText();
await page.mouse.wheel(0, 700);
await page.waitForTimeout(250);
const afterScroll = await page.locator("#seo-market-panel").innerText();
console.log("before", before.replace(/\s+/g, " ").slice(0, 90));
console.log("click", afterClick.replace(/\s+/g, " ").slice(0, 90));
console.log("scroll", afterScroll.replace(/\s+/g, " ").slice(0, 90));
await page.close();

const reduced = await open(1440, true);
const reducedPanel = reduced.locator("#seo-market-panel");
await reducedPanel.scrollIntoViewIfNeeded();
await reduced.waitForTimeout(200);
console.log("reduced", (await reducedPanel.innerText()).replace(/\s+/g, " ").slice(0, 90));
await reduced.screenshot({ path: path.join(dir, "local-reduced-1440.png"), clip: { x: 0, y: 80, width: 1440, height: 820 } });
await reduced.close();

for (const route of ["/services/email-marketing/", "/services/television-advertising/"]) {
  const audit = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await audit.goto(`http://127.0.0.1:3001${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await audit.locator("h1").waitFor();
  const tall = await audit.evaluate(() =>
    [...document.querySelectorAll("main section")].map((section) => ({
      heading: (section.querySelector("h2")?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48),
      height: Math.round(section.getBoundingClientRect().height),
    })).filter((section) => section.height > 900),
  );
  console.log(route, JSON.stringify(tall));
  await audit.close();
}

await browser.close();

// Visual QA: every crawled 200 page at 390/768/1440. Screenshots only for pages with issues.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = "http://localhost:3107";
const OUT = process.env.QA_OUT || path.join(os.tmpdir(), "kosick-launch-qa");
fs.mkdirSync(OUT, { recursive: true });
const crawl = JSON.parse(fs.readFileSync(path.join(OUT, "crawl.json"), "utf8"));
const pages = Object.entries(crawl.pages).filter(([, v]) => v.status === 200).map(([p]) => p);
const only = process.argv[2] ? process.argv[2].split(",") : null;
const list = only || pages;
const WIDTHS = [390, 768, 1440];
const shots = path.join(OUT, "shots");
fs.mkdirSync(shots, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const results = [];

async function audit(width, route) {
  const context = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, deviceScaleFactor: 1, hasTouch: width < 800, isMobile: width < 500 });
  const page = await context.newPage();
  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 160)); });
  page.on("response", (r) => { if (r.status() >= 400 && !/favicon|google|vimeo\.com\/api|doubleclick/.test(r.url())) failed.push(r.status() + " " + r.url().slice(0, 140)); });
  try {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 90_000 });
  } catch (e) {
    results.push({ route, width, fatal: String(e).slice(0, 200) });
    await context.close();
    return;
  }
  // Walk down the page so reveal animations and lazy images settle
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const clipped = (el) => {
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) return true;
      }
      return false;
    };
    const visible = (el) => {
      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const label = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""} ${(el.textContent || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 40)}`;
    const overflow = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= vw + 1 || r.left < -5000) continue;
      if (el.closest("[aria-hidden='true']") || clipped(el) || !visible(el)) continue;
      overflow.push(`${label(el)} right=${Math.round(r.right)}`);
      if (overflow.length > 5) break;
    }
    const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && visible(i) && !i.closest("[aria-hidden='true']")).map((i) => (i.currentSrc || i.src).slice(0, 120));
    const taps = [...document.querySelectorAll("main a[href], main button, header a[href], header button, footer a[href], footer button")]
      .filter((el) => visible(el) && !el.closest("[aria-hidden='true']"))
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width < 24 && r.height < 24; })
      .map(label).slice(0, 6);
    const tiny = [...document.querySelectorAll("main p, main li, main span, main a")]
      .filter((el) => el.childElementCount === 0 && el.textContent.trim().length > 2 && visible(el) && parseFloat(getComputedStyle(el).fontSize) < 12)
      .map((el) => `${parseFloat(getComputedStyle(el).fontSize)}px ${label(el)}`).slice(0, 4);
    const h1 = document.querySelectorAll("h1").length;
    const imgNoAlt = [...document.querySelectorAll("img:not([alt])")].length;
    return {
      scrollW: document.documentElement.scrollWidth - vw,
      overflow, broken, taps, tiny, h1, imgNoAlt,
      height: document.documentElement.scrollHeight,
    };
  });
  const issue = info.scrollW > 1 || info.broken.length || errors.length || info.h1 !== 1;
  let shot = null;
  if (issue) {
    shot = path.join(shots, `${route.replace(/\W+/g, "_") || "home"}-${width}.png`);
    await page.screenshot({ path: shot, fullPage: false });
  }
  results.push({ route, width, ...info, errors: [...new Set(errors)].slice(0, 5), failed: [...new Set(failed)].slice(0, 5), shot });
  await context.close();
}

const jobs = [];
for (const route of list) for (const width of WIDTHS) jobs.push([width, route]);
const CONC = 4;
let i = 0;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (i < jobs.length) {
    const [w, r] = jobs[i++];
    await audit(w, r);
  }
}));
await browser.close();
fs.writeFileSync(path.join(OUT, "visual.json"), JSON.stringify(results, null, 1));
const bad = results.filter((r) => r.fatal || r.scrollW > 1 || r.broken?.length || r.errors?.length || r.failed?.length || r.h1 !== 1 || r.imgNoAlt);
console.log("checked", results.length, "with issues", bad.length);
for (const r of bad) console.log(JSON.stringify(r));

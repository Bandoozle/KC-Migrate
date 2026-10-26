import { chromium } from "playwright";

const widths = (process.argv[2] || "1440,390").split(",").map(Number);
const browser = await chromium.launch({ channel: "msedge" });

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("http://localhost:3001/services/digital-connected-tv/", { waitUntil: "networkidle", timeout: 120000 });
  const tabs = page.locator("[role='tab']");
  const count = await tabs.count();
  const heights = [];
  for (let index = 0; index < count; index += 1) {
    await tabs.nth(index).click();
    await page.waitForTimeout(250);
    const info = await page.evaluate(() => {
      const panel = [...document.querySelectorAll("[role='tabpanel']")].find((node) => node.getAttribute("aria-hidden") !== "true");
      const stage = document.querySelector("[class*='stage']");
      const shown = [...document.querySelectorAll("[class*='visual']")]
        .filter((node) => getComputedStyle(node).opacity === "1")
        .map((node) => node.innerText.replace(/\s+/g, " ").trim().slice(0, 80) || node.querySelector("img")?.alt || "photo");
      const on = [...document.querySelectorAll("[class*='device']")]
        .filter((node) => node.getAttribute("data-on") === "true")
        .map((node) => node.textContent.replace(/\s+/g, " ").trim());
      return {
        label: panel?.querySelector("h3")?.textContent,
        body: panel?.querySelector("p")?.textContent?.slice(0, 70),
        shown,
        on,
        h: Math.round(document.querySelector("[class*='showcase']")?.getBoundingClientRect().height || 0),
      };
    });
    heights.push(info.h);
    console.log(width, "tab", index, JSON.stringify(info));
  }
  await tabs.nth(count - 1).focus();
  await page.keyboard.press("ArrowRight");
  const selected = await page.locator("[role='tab'][aria-selected='true']").innerText();
  const partners = await page.locator("[class*='partnerName']").allTextContents();
  const bad = partners.filter((name) => /screenshot|partner \d/i.test(name));
  const tiny = await page.evaluate(() =>
    [...document.querySelectorAll("main p, main li, main h2, main h3, main span, main a, main button")]
      .filter((node) => node.innerText.trim() && parseFloat(getComputedStyle(node).fontSize) < 12)
      .map((node) => `${getComputedStyle(node).fontSize} ${node.innerText.slice(0, 40)}`),
  );
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(width, "keys", selected.replace(/\s+/g, " "), "heights", [...new Set(heights)], "overflow", overflow);
  console.log(width, "partners", partners.join(" | "));
  console.log(width, "bad names", bad, "tiny", tiny.slice(0, 8), "errors", errors.slice(0, 4));
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/digital-connected-tv/", { waitUntil: "networkidle", timeout: 120000 });
const meta = await page.evaluate(() => ({
  title: document.title,
  canonical: document.querySelector("link[rel=canonical]")?.href,
  h1: document.querySelectorAll("h1").length,
  jsonld: [...document.querySelectorAll("script[type='application/ld+json']")].map((node) => node.textContent.slice(0, 80)),
  links: [...new Set([...document.querySelectorAll("main a[href]")].map((anchor) => anchor.getAttribute("href")))],
}));
console.log("meta", JSON.stringify(meta, null, 1));
const faq = page.locator("main [aria-expanded]").first();
const before = await faq.getAttribute("aria-expanded");
await faq.click();
console.log("faq", before, "->", await faq.getAttribute("aria-expanded"));
for (const href of meta.links) {
  if (!href.startsWith("/")) {
    console.log("skip", href);
    continue;
  }
  const res = await fetch("http://localhost:3001" + href, { redirect: "manual" });
  console.log(res.status, href);
}
await browser.close();

import { chromium } from "playwright";

const base = "http://localhost:3001";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/services/outdoor-advertising/`, { waitUntil: "networkidle" });

const hrefs = await page.$$eval("main a[href]", (as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
for (const href of hrefs) {
  if (!href.startsWith("/")) { console.log("skip", href); continue; }
  const res = await fetch(base + href, { redirect: "manual" });
  console.log(res.status, href);
}

const faq = page.locator("main [aria-expanded]").first();
const before = await faq.getAttribute("aria-expanded");
await faq.click();
await page.waitForTimeout(400);
console.log("faq toggle", before, "->", await faq.getAttribute("aria-expanded"));
await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/radio-advertising/", { waitUntil: "networkidle", timeout: 120000 });
const info = await page.evaluate(() => ({
  links: [...new Set([...document.querySelectorAll("main a[href]")].map((a) => a.getAttribute("href")))],
  h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
  h2: [...document.querySelectorAll("main h2")].map((h) => h.textContent.trim()),
  canonical: document.querySelector("link[rel=canonical]")?.href,
  title: document.title,
  jsonld: document.querySelectorAll("script[type='application/ld+json']").length,
  imgs: [...document.querySelectorAll("main img")].map((img) => `${img.alt} | ${img.naturalWidth}`),
}));
console.log(JSON.stringify(info, null, 2));
for (const href of info.links.filter((h) => h.startsWith("/"))) {
  const r = await page.request.get(`http://localhost:3001${href}`, { maxRedirects: 0 }).catch((e) => ({ status: () => String(e) }));
  console.log(r.status(), href);
}
const faq = page.locator("main button[aria-expanded]").nth(1);
await faq.click();
console.log("faq expanded:", await faq.getAttribute("aria-expanded"));
await browser.close();

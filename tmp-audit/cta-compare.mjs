import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const [tag, path] of [
  ["cb", "/services/corporate-branding/"],
  ["radio", "/services/radio-advertising/"],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1200);
  const section = page.locator("main > section").last();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await section.screenshot({ path: `tmp-audit/shots/cta-${tag}.png` });
  const info = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    cls: document.querySelector("main > section:last-of-type")?.className,
    links: [...document.querySelectorAll("main > section:last-of-type a")].map((a) => `${a.textContent.trim()} -> ${a.getAttribute("href")}`),
  }));
  console.log(tag, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

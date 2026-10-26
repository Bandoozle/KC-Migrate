import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/creative/", { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(2000);
for (let y = 0; y < 12000; y += 700) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(120);
}
await page.waitForTimeout(800);
await page.screenshot({ path: "tmp-audit/shots/cr-old-d.png", fullPage: true });
const info = await page.evaluate(() => ({
  sections: [...document.querySelectorAll("main > *")].map((s) => [
    s.tagName,
    (s.className || "").toString().slice(0, 60),
    s.querySelector("h1,h2")?.textContent.trim().slice(0, 60) ?? "",
    Math.round(s.getBoundingClientRect().height),
  ]),
  learnMore: [...document.querySelectorAll("main a")].filter((a) => /learn more/i.test(a.textContent)).length,
  words: document.querySelector("main").innerText.split(/\s+/).length,
  iframes: [...document.querySelectorAll("main iframe")].map((f) => f.src),
}));
console.log(JSON.stringify(info, null, 1));
await browser.close();

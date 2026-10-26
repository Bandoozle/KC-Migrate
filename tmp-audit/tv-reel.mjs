import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/services/television-advertising/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1500);
  const section = page.locator("section[aria-labelledby='tv-reach']");
  await section.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1800);
  await section.screenshot({ path: `tmp-audit/shots/tv-reel-${width}.png` });
  const info = await page.evaluate(() => {
    const s = document.querySelector("section[aria-labelledby='tv-reach']");
    const steps = [...s.querySelectorAll("ol li")].map((li) => {
      const r = li.getBoundingClientRect();
      return `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} o${getComputedStyle(li).opacity}`;
    });
    const cta = s.querySelector("a");
    return {
      h1: document.querySelectorAll("h1").length,
      h2: s.querySelector("h2").textContent,
      cta: `${cta.textContent.trim()} -> ${cta.getAttribute("href")} w${Math.round(cta.getBoundingClientRect().width)}`,
      bodyLines: Math.round(s.querySelector("p:not(:first-child)")?.getBoundingClientRect().height / parseFloat(getComputedStyle(s.querySelector("h2 + *") ?? s).lineHeight || 1)),
      words: s.innerText.split(/\s+/).filter(Boolean).length,
      steps,
      overflow: document.documentElement.scrollWidth - innerWidth,
      learnMore: [...s.querySelectorAll("a")].filter((a) => /learn more/i.test(a.textContent)).length,
    };
  });
  console.log(width, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

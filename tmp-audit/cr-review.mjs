import { chromium } from "playwright";
const tag = process.argv[2] || "v1";
const widths = (process.argv[3] || "1440,768,390").split(",").map(Number);
const browser = await chromium.launch({ channel: "msedge" });
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
  await page.goto("http://localhost:3000/services/creative/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1500);
  for (let y = 0; y < 14000; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(1200);
  const sections = page.locator("main > section");
  const count = await sections.count();
  for (let i = 0; i < count; i++) {
    const s = sections.nth(i);
    await s.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await s.screenshot({ path: `tmp-audit/shots/cr-${tag}-${width}-${i}.png` });
  }
  const info = await page.evaluate(() => {
    const main = document.querySelector("main");
    const wide = [...main.querySelectorAll("*")].filter((el) => el.getBoundingClientRect().right > innerWidth + 1).map((el) => el.className?.toString().slice(0, 50));
    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      wide: wide.slice(0, 5),
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
      headings: [...main.querySelectorAll("h2,h3")].map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 50)}`),
      learnMore: [...main.querySelectorAll("a")].filter((a) => /learn more/i.test(a.textContent)).length,
      words: main.innerText.split(/\s+/).filter(Boolean).length,
      smallText: [...main.querySelectorAll("p,li,span,a,button,figcaption")]
        .filter((el) => el.childElementCount === 0 && el.textContent.trim() && parseFloat(getComputedStyle(el).fontSize) < 12.5)
        .map((el) => `${el.textContent.trim().slice(0, 20)}:${getComputedStyle(el).fontSize}`)
        .slice(0, 8),
      uppercase: [...main.querySelectorAll("*")].filter((el) => getComputedStyle(el).textTransform === "uppercase").length,
    };
  });
  console.log(`\n[${width}]`, JSON.stringify(info, null, 0), "errors", JSON.stringify(errors.slice(0, 5)));
  await page.close();
}
await browser.close();

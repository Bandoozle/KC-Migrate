import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3000/services/digital-connected-tv/", { waitUntil: "load", timeout: 90000 });
  const info = await page.evaluate(() =>
    [...document.querySelectorAll("p")]
      .filter((p) =>
        /Connected TV, online video|Creative aligned|Premium sports/.test(p.textContent),
      )
      .map((p) => {
        const s = getComputedStyle(p);
        const r = p.getBoundingClientRect();
        const parent = p.parentElement.getBoundingClientRect();
        return {
          text: p.textContent.trim().slice(0, 42),
          align: s.textAlign,
          leftGap: Math.round(r.left - parent.left),
          rightGap: Math.round(parent.right - r.right),
        };
      }),
  );
  console.log(width, JSON.stringify(info));
  await page.close();
}
await browser.close();

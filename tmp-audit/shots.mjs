import { chromium } from "playwright";

// Usage: node tmp-audit/shots.mjs <desktop|phone> <out-prefix> <path>[#selector] ...
const [mode, prefix, ...targets] = process.argv.slice(2);
const vp = mode === "phone" ? { width: 390, height: 844, dpr: 3 } : { width: 1440, height: 900, dpr: 1 };
const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, reducedMotion: "reduce" });
const page = await context.newPage();
let n = 0;
for (const target of targets) {
  const [path, selector] = target.split("#");
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "load" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  const file = `${prefix}-${++n}.png`;
  if (selector) {
    const el = page.locator(selector).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await el.screenshot({ path: file, scale: "css" });
  } else {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: file, scale: "css" });
  }
  console.log(file, path, selector ?? "");
}
await browser.close();

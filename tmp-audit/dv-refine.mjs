import { chromium } from "playwright";

const URL = "http://localhost:3000/services/digital-connected-tv/";
const browser = await chromium.launch({ channel: "msedge" });

function lum([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return ((x + 0.05) / (y + 0.05)).toFixed(2);
};
const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 4).map(Number);

for (const [name, width, height] of [["m", 390, 844], ["t", 768, 1024], ["d", 1440, 900]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`\n[${name}] ${width}px overflow=${overflow} errors=${errors.length}`);

  // hero buttons
  const p = page.locator("a[class*='primary']").first();
  const s = page.locator("a[class*='secondary']").first();
  await page.screenshot({ path: `tmp-audit/shots/dv2-${name}-hero.png` });
  const state = async (loc, label) => {
    const v = await loc.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { color: cs.color, bg: cs.backgroundColor, border: cs.borderTopColor, h: el.getBoundingClientRect().height };
    });
    const bg = parse(v.bg);
    const fgc = parse(v.color);
    const base = bg[3] === 0 || bg.length === 4 && bg[3] < 0.5 ? [12, 12, 14] : bg.slice(0, 3);
    console.log(label, v.color, v.bg, `contrast=${ratio(fgc.slice(0, 3), base)} h=${Math.round(v.h)}`);
  };
  await state(p, "primary normal");
  await state(s, "secondary normal");
  if (name === "d") {
    await p.hover();
    await page.waitForTimeout(250);
    await state(p, "primary hover");
    await s.hover();
    await page.waitForTimeout(250);
    await state(s, "secondary hover");
    await page.mouse.move(5, 5);
    await p.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    const out = await p.evaluate((el) => getComputedStyle(el).outlineStyle + " " + getComputedStyle(el).outlineColor + " " + getComputedStyle(el).outlineWidth);
    console.log("primary focus outline:", out);
    await page.screenshot({ path: `tmp-audit/shots/dv2-${name}-focus.png`, clip: { x: 0, y: 200, width: 700, height: 420 } });
  }

  // formats
  const formats = page.locator("#dv-formats").locator("xpath=ancestor::section");
  await formats.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await formats.screenshot({ path: `tmp-audit/shots/dv2-${name}-formats.png` });
  const cardHeights = await formats.locator("article").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
  const bodyLines = await formats.locator("article p:last-child").evaluateAll((els) =>
    els.map((e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight))),
  );
  console.log("format card heights", cardHeights, "body lines", bodyLines);

  // steps
  const steps = page.locator("#dv-steps").locator("xpath=ancestor::section");
  await steps.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await steps.screenshot({ path: `tmp-audit/shots/dv2-${name}-steps.png` });
  const stepBoxes = await steps.locator("ol > li").evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }));
  console.log("step boxes", JSON.stringify(stepBoxes));
  if (name === "d") {
    const first = steps.locator("ol > li").first();
    const before = await first.evaluate((el) => el.getBoundingClientRect().y);
    await first.hover();
    await page.waitForTimeout(300);
    const after = await first.evaluate((el) => ({ y: el.getBoundingClientRect().y, b: getComputedStyle(el).borderTopColor }));
    console.log("step hover lift px:", (before - after.y).toFixed(1), after.b);
    await page.mouse.move(5, 5);
  }

  // partners
  const partners = page.locator("#dv-partners").locator("xpath=ancestor::section");
  await partners.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await partners.screenshot({ path: `tmp-audit/shots/dv2-${name}-partners-all.png` });
  const tabs = partners.getByRole("tab");
  const labels = await tabs.allTextContents();
  console.log("tabs", labels);
  const counts = {};
  for (let i = 0; i < labels.length; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(350);
    counts[labels[i]] = await partners.locator("ul img").count();
  }
  console.log("logo counts", JSON.stringify(counts));
  const tabH = await tabs.first().evaluate((el) => Math.round(el.getBoundingClientRect().height));
  console.log("tab height", tabH);
  await tabs.nth(1).click();
  await page.waitForTimeout(350);
  await partners.screenshot({ path: `tmp-audit/shots/dv2-${name}-partners-sports.png` });

  // keyboard
  await tabs.first().click();
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  console.log("after 2x ArrowRight selected:", await partners.locator("[role=tab][aria-selected=true]").textContent());
  await page.keyboard.press("End");
  console.log("End:", await partners.locator("[role=tab][aria-selected=true]").textContent());
  await page.keyboard.press("Home");
  console.log("Home:", await partners.locator("[role=tab][aria-selected=true]").textContent());
  await page.keyboard.press("ArrowLeft");
  console.log("ArrowLeft wrap:", await partners.locator("[role=tab][aria-selected=true]").textContent());
  await tabs.first().click();
  await page.waitForTimeout(350);

  // logo sizing
  const sizes = await partners.locator("ul img").evaluateAll((els) =>
    els.map((e) => ({ alt: e.alt, w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), nw: e.naturalWidth, nh: e.naturalHeight })),
  );
  if (name === "d") console.log("logo sizes", JSON.stringify(sizes));
  const stretched = sizes.filter((s) => Math.abs(s.w / s.h - s.nw / s.nh) > 0.05);
  console.log("stretched logos:", stretched.length, "min rendered w/h:", Math.min(...sizes.map((s) => s.w)), Math.min(...sizes.map((s) => s.h)));
  console.log("empty alts:", sizes.filter((s) => !s.alt).length, "total", sizes.length);
  await page.close();
}
await browser.close();

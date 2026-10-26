import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const widths = (process.argv[2] || "1440,768,390,1920").split(",").map(Number);
const shoot = process.argv[3] === "shots";
mkdirSync("tmp-audit/shots", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("http://localhost:3001/services/outdoor-advertising/", { waitUntil: "networkidle", timeout: 120000 });
  const section = page.locator("section[aria-labelledby='outdoor-formats']");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const tabs = section.getByRole("tab");
  const count = await tabs.count();
  const state = () =>
    section.evaluate((root) => {
      const frames = [...root.querySelectorAll("[data-active]")].filter((el) => el.querySelector("img"));
      const shown = frames.filter((el) => getComputedStyle(el).opacity === "1").map((el) => {
        const img = el.querySelector("img");
        let src = img.currentSrc;
        try { src = new URL(src).searchParams.get("url") || src; } catch {}
        return `${src.split("/").pop()} (${img.naturalWidth}px, alt="${img.alt.slice(0, 40)}")`;
      });
      const panel = root.querySelector("[role='tabpanel'][data-active='true']");
      const visible = [...root.querySelectorAll("[role='tabpanel']")].filter((el) => getComputedStyle(el).visibility === "visible").length;
      const cta = panel?.querySelector("a");
      return {
        shown,
        title: panel?.querySelector("h3")?.textContent,
        price: panel?.querySelector("h3 + p")?.textContent,
        size: panel?.querySelector("dd")?.textContent,
        cta: cta ? `${cta.textContent} -> ${cta.getAttribute("href")} color=${getComputedStyle(cta).color}` : null,
        visible,
        label: root.querySelector("[aria-hidden='true'] span")?.parentElement?.textContent,
        h: Math.round(root.getBoundingClientRect().height),
      };
    });

  console.log(`\n== ${width}px, ${count} tabs`);
  const heights = new Set();
  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(500);
    const s = await state();
    heights.add(s.h);
    console.log(`tab ${i}:`, JSON.stringify(s));
    if (shoot) await section.screenshot({ path: `tmp-audit/shots/formats-${width}-tab${i}.png` });
  }
  await tabs.nth(0).click();
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  const right = await page.evaluate(() => document.activeElement?.textContent);
  await page.keyboard.press("End");
  const end = await page.evaluate(() => document.activeElement?.textContent);
  await page.keyboard.press("ArrowRight");
  const wrap = (await state()).title;
  console.log("keys:", { right, end, wrapsTo: wrap });

  const links = await page.evaluate(() => [...new Set([...document.querySelectorAll("main a[href]")].map((a) => a.getAttribute("href")))]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const tiny = await page.evaluate(() =>
    [...document.querySelectorAll("main p, main li, main span, main a, main dd, main dt")]
      .filter((el) => el.offsetParent && el.textContent.trim() && parseFloat(getComputedStyle(el).fontSize) < 12)
      .map((el) => `${el.textContent.trim().slice(0, 30)}:${getComputedStyle(el).fontSize}`)
      .slice(0, 8),
  );
  console.log("heights:", [...heights], "overflow:", overflow, "tiny text:", tiny, "errors:", errors);
  if (width === widths[0]) console.log("links:", links);
  await page.close();
}
await browser.close();

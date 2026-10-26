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
  await page.goto("http://localhost:3001/services/radio-advertising/", { waitUntil: "networkidle", timeout: 120000 });
  const section = page.locator("section[aria-labelledby='radio-formats']");
  await section.scrollIntoViewIfNeeded();
  const tabs = section.getByRole("tab");
  const count = await tabs.count();

  const state = async () =>
    section.evaluate((root) => {
      const live = [...root.querySelectorAll("[data-live='true']")].map((el) => el.firstElementChild?.textContent);
      const needle = [...root.querySelectorAll("[data-live='true'] [class*='needle']")].map((el) => el.style.left);
      const panel = root.querySelector("[role='tabpanel'][data-active='true'] h3")?.textContent;
      const visiblePanels = [...root.querySelectorAll("[role='tabpanel']")].filter((el) => getComputedStyle(el).visibility === "visible").length;
      const pressed = [...root.querySelectorAll("[role='tabpanel'][data-active='true'] [aria-pressed='true']")].map((el) => el.textContent);
      return {
        readout: root.querySelector("[aria-live]")?.textContent?.replace(/\s+/g, " ").trim(),
        live,
        needle,
        panel,
        visiblePanels,
        pressed,
        h: Math.round(root.getBoundingClientRect().height),
      };
    });

  console.log(`\n== ${width}px, ${count} tabs`);
  const heights = new Set();
  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(750);
    const s = await state();
    heights.add(s.h);
    console.log(`tab ${i}:`, JSON.stringify(s));
    if (shoot) await section.screenshot({ path: `tmp-audit/shots/dial-${width}-tab${i}.png` });
    const stations = section.locator("[role='tabpanel'][data-active='true'] button[aria-pressed]");
    const n = await stations.count();
    for (let j = 1; j < n; j++) {
      await stations.nth(j).click();
      await page.waitForTimeout(650);
      const t = await state();
      heights.add(t.h);
      console.log(`   station ${j}:`, JSON.stringify({ readout: t.readout, needle: t.needle, pressed: t.pressed, h: t.h }));
    }
  }

  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowDown");
  const afterDown = await page.evaluate(() => document.activeElement?.textContent);
  await page.keyboard.press("End");
  const afterEnd = await page.evaluate(() => document.activeElement?.textContent);
  await page.keyboard.press("Home");
  const afterHome = await state();
  console.log("keys:", { afterDown, afterEnd, home: afterHome.panel });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log("heights:", [...heights], "overflow:", overflow, "errors:", errors);
  await page.close();
}
await browser.close();

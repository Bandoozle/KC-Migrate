import { chromium } from "playwright";

const widths = (process.argv[2] || "1440").split(",").map(Number);
const clickSteps = process.argv[3] === "steps";
const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const section = page.locator("section", { has: page.locator('[aria-label="Commercial production sequence"], [aria-label="Commercial production steps"]') }).first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const steps = section.locator('[role="tab"], [aria-label="Commercial production sequence"] button');
  const count = clickSteps ? await steps.count() : 1;
  for (let i = 0; i < count; i++) {
    if (clickSteps) {
      await steps.nth(i).click();
      await page.waitForTimeout(350);
    }
    const info = await section.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const screen = el.querySelector("figure");
      const s = screen?.getBoundingClientRect();
      const box = (node) => {
        const b = node?.getBoundingClientRect();
        return b ? `${Math.round(b.x)},${Math.round(b.y - r.y)} ${Math.round(b.width)}x${Math.round(b.height)}` : "-";
      };
      const panel = el.querySelector('[role="tabpanel"][data-active="true"]');
      const monitor = screen?.firstElementChild;
      return {
        height: Math.round(r.height),
        screen: box(screen),
        tabs: box(el.querySelector('[role="tablist"], ol')),
        details: box(panel?.parentElement),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        monitorOverflow: monitor ? monitor.scrollHeight - monitor.clientHeight : "-",
        caption: screen?.querySelector("figcaption")?.textContent,
        panel: panel?.textContent.slice(0, 160),
      };
    });
    console.log(width, `step ${i + 1}`, JSON.stringify(info));
    await section.screenshot({ path: `tmp-audit/story-${width}-${i + 1}.png` });
  }
  await page.close();
}
await browser.close();

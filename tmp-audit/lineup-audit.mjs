import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const widths = (process.argv[2] || "1440,1024,768,390").split(",").map(Number);

for (const width of widths) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const tabs = page.locator('[role="tab"]');
  const count = await tabs.count();
  console.log(`\n== ${width}`);
  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(250);
    const data = await page.evaluate(() => {
      const section = document.querySelector('[role="tablist"]').closest("section");
      const top = section.getBoundingClientRect().y;
      const q = (sel) => section.querySelector(sel);
      const r = (el) => (el ? el.getBoundingClientRect() : null);
      const panel = q("[role=tabpanel]");
      const kids = [...panel.children];
      const fmt = (el) => {
        const b = r(el);
        return b ? `${Math.round(b.x)},${Math.round(b.y - top)} ${Math.round(b.width)}x${Math.round(b.height)}` : "-";
      };
      const tuner = q("[role=tablist]");
      const summary = kids.find((k) => k.className.includes("programSummary"));
      const monitor = kids.find((k) => k.className.includes("monitor"));
      const support = kids.find((k) => k.className.includes("support"));
      const head = support?.firstElementChild;
      const body = support?.lastElementChild;
      return {
        tuner: fmt(tuner),
        summary: fmt(summary),
        monitor: fmt(monitor),
        stageBottom: Math.round(Math.max(r(tuner).bottom, r(summary)?.bottom ?? 0, r(monitor).bottom) - top),
        head: fmt(head),
        body: fmt(body),
        headFont: head?.querySelector("h3") ? getComputedStyle(head.querySelector("h3")).fontSize : "-",
        sectionHeight: Math.round(section.getBoundingClientRect().height),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    console.log(`tab ${i + 1}`, JSON.stringify(data));
    const section = page.locator('[role="tablist"]').locator("xpath=ancestor::section[1]");
    await section.screenshot({ path: `tmp-audit/lineup-${width}-${i + 1}.png` });
  }
}
await browser.close();

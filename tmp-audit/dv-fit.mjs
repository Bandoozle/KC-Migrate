import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const [name, width, height] of [["d", 1440, 900], ["t", 768, 1024], ["m", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000/services/digital-connected-tv/", { waitUntil: "networkidle" });
  const partners = page.locator("#dv-partners").locator("xpath=ancestor::section");
  await partners.scrollIntoViewIfNeeded();
  const tabs = partners.getByRole("tab");
  for (const label of ["Audio", "Streaming", "Sports", "All"]) {
    await tabs.filter({ hasText: new RegExp(`^${label}$`) }).click();
    await page.waitForTimeout(400);
    const m = await partners.locator("[role=tabpanel]").evaluate((el) => {
      const r = el.getBoundingClientRect();
      const p = el.parentElement.getBoundingClientRect();
      const cells = [...el.querySelectorAll("li")].map((c) => Math.round(c.getBoundingClientRect().width));
      return { canvasW: Math.round(r.width), containerW: Math.round(p.width), cells: cells.slice(0, 7), overflow: document.documentElement.scrollWidth - innerWidth };
    });
    console.log(name, label, JSON.stringify(m), await partners.locator(".\\30 ").count());
    await partners.screenshot({ path: `tmp-audit/shots/dv3-${name}-${label}.png` });
  }
  await page.close();
}
await browser.close();

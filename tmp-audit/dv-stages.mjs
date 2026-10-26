import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3001/services/digital-connected-tv/", { waitUntil: "networkidle", timeout: 120000 });
  const tabs = page.locator("[role='tab']");
  for (const index of [0, 2, 3]) {
    await tabs.nth(index).click();
    await page.waitForTimeout(200);
    const stage = page.locator("[class*='stageColumn']");
    await stage.screenshot({ path: `tmp-audit/shots/dv-stage-${width}-tab${index}.png` });
  }
  await page.close();
}
await browser.close();

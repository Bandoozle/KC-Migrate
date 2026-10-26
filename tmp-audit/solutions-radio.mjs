import { chromium } from "playwright";

const browser = await chromium.launch();
for (const width of [390, 768]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded", timeout: 60000 });
  const card = page.getByRole("link", { name: /Audio spots and sponsorships/ });
  await card.waitFor();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await card.screenshot({ path: `tmp-audit/solutions/radio-${width}.png` });
}
await browser.close();

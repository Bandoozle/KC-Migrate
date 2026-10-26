import { chromium } from "playwright";
import path from "node:path";

const out = path.resolve("tmp-audit/direction");
const browser = await chromium.launch();

async function shot(page, name) {
  await page.screenshot({ path: path.join(out, name) });
}

for (const width of [390, 1440]) {
  const golf = await browser.newPage({ viewport: { width, height: 900 } });
  await golf.goto("http://127.0.0.1:3001/services/golf-marketing/", { waitUntil: "domcontentloaded" });
  await golf.locator("h1").waitFor();
  await golf.waitForTimeout(500);
  await shot(golf, `golf-hero-${width}.png`);
  await golf.locator("h2", { hasText: "Revenue growth" }).scrollIntoViewIfNeeded();
  await golf.waitForTimeout(300);
  await shot(golf, `golf-mid-${width}.png`);
  const tab = golf.getByRole("tab", { name: /facebook/i });
  if (await tab.count()) {
    await tab.scrollIntoViewIfNeeded();
    await tab.click();
    await golf.waitForTimeout(400);
    await shot(golf, `golf-channel-${width}.png`);
  }
  await golf.close();

  const dental = await browser.newPage({ viewport: { width, height: 900 } });
  await dental.goto("http://127.0.0.1:3001/services/dental-marketing/", { waitUntil: "domcontentloaded" });
  await dental.locator("h1").waitFor();
  await dental.waitForTimeout(500);
  await shot(dental, `dental-hero-${width}.png`);
  const step = dental.getByRole("link", { name: /Appointment Conversion/i });
  await step.click();
  await dental.waitForTimeout(400);
  const hash = new URL(dental.url()).hash;
  console.log("dental", width, "hash", hash, "overflow check later");
  await shot(dental, `dental-jump-${width}.png`);
  await dental.close();
}

await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch();
for (const width of [390, 768]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3001/services/television-advertising/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("h1").waitFor({ timeout: 20000 });
  const story = page.locator("section").filter({ has: page.getByRole("heading", { name: "Compelling TV commercial production" }) });
  await story.scrollIntoViewIfNeeded();
  await story.screenshot({ path: `tmp-audit/tv-page/story-${width}.png` });
  const tuner = page.locator("[role='tablist']");
  await tuner.scrollIntoViewIfNeeded();
  const box = await tuner.boundingBox();
  console.log(width, "tuner", box);
  await tuner.screenshot({ path: `tmp-audit/tv-page/tuner-${width}.png` });
}
await browser.close();

import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const [tag, width] of [["d", 1440], ["m", 390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/services/creative/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(2500);
  const out = {};

  // Hero ambient reel
  const heroVideo = page.locator("section[aria-labelledby='cp-hero'] video");
  out.heroPlaying = await heroVideo.evaluate((v) => !v.paused);
  await page.getByRole("button", { name: /pause aerial footage/i }).click();
  out.heroPausedAfterClick = await heroVideo.evaluate((v) => v.paused);
  out.heroToggleLabel = await page.locator("section[aria-labelledby='cp-hero'] button").getAttribute("aria-label");

  // Capability selector
  const tabs = page.getByRole("tab");
  await tabs.nth(2).click();
  out.clickDesign = await page.locator("[role=tabpanel]:not([hidden]) h3").textContent();
  await page.keyboard.press("ArrowRight");
  out.arrowAudio = await page.locator("[role=tabpanel]:not([hidden]) h3").textContent();
  await page.keyboard.press("ArrowRight");
  out.wrapVideo = await page.locator("[role=tabpanel]:not([hidden]) h3").textContent();
  await page.keyboard.press("End");
  out.end = await page.locator("[role=tabpanel]:not([hidden]) h3").textContent();
  if (width > 900) {
    await tabs.nth(1).hover();
    out.hoverMotion = await page.locator("[role=tabpanel]:not([hidden]) h3").textContent();
  }
  out.visiblePanels = await page.locator("[role=tabpanel]:not([hidden])").count();
  out.minTab = await tabs.evaluateAll((els) => Math.round(Math.min(...els.map((e) => Math.min(e.getBoundingClientRect().height, e.getBoundingClientRect().width)))));

  // Storyboard
  await page.locator("#motion").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /00:42/ }).click();
  const mv = page.locator("#motion video");
  await page.waitForFunction(() => {
    const v = document.querySelector("#motion video");
    return v && v.currentTime > 41 && !v.paused;
  }, null, { timeout: 30000 }).catch(() => {});
  out.storyboardTime = await mv.evaluate((v) => Math.round(v.currentTime));
  out.storyboardPressed = await page.locator("#motion [aria-pressed=true]").textContent();
  await mv.evaluate((v) => v.pause());

  // Film player
  await page.locator("#video").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /play the brand spot/i }).click();
  await page.waitForFunction(() => {
    const v = document.querySelector("#video video");
    return v && !v.paused && v.currentTime > 0.2;
  }, null, { timeout: 30000 }).catch(() => {});
  out.filmPlaying = await page.locator("#video video").evaluate((v) => !v.paused && v.controls);
  await page.locator("#video video").evaluate((v) => v.pause());

  // Anchor from selector
  await page.locator("[role=tabpanel]:not([hidden]) a").first().click();
  await page.waitForTimeout(600);
  out.hash = await page.evaluate(() => location.hash);

  console.log(tag, JSON.stringify(out), "errors", JSON.stringify(errors));
  await page.close();
}
await browser.close();

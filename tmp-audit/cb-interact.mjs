import { chromium } from "playwright";

const sizes = { d: [1440, 900], t: [768, 1024], m: [390, 844] };
const browser = await chromium.launch({ channel: "msedge" });
for (const name of ["d", "t", "m"]) {
  const [width, height] = sizes[name];
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("http://localhost:3000/services/corporate-branding/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1200);
  await page.addStyleTag({ content: "header, nextjs-portal, [class*='hatWidget'], [class*='chat'] { visibility: hidden !important; }" });

  // anatomy
  const legend = page.locator("button[aria-pressed]");
  const spot = page.locator("[class*='spot']").first();
  await legend.nth(1).scrollIntoViewIfNeeded();
  await legend.nth(1).hover();
  await page.waitForTimeout(450);
  const hoverVisible = await spot.getAttribute("data-visible");
  await legend.nth(4).click();
  await page.mouse.move(2, 2);
  await page.waitForTimeout(450);
  const pinned = await legend.nth(4).getAttribute("aria-pressed");
  const pinnedVisible = await spot.getAttribute("data-visible");
  const anatomy = page.locator("[class*='anatomy']").first();
  await anatomy.screenshot({ path: `tmp-audit/shots/cb-anatomy-${name}.png` });
  await legend.nth(4).click();
  await page.waitForTimeout(300);
  const cleared = await spot.getAttribute("data-visible");
  console.log(`[${name}] anatomy hover=${hoverVisible} pinned=${pinned}/${pinnedVisible} cleared=${cleared}`);

  // process tabs
  const tabs = page.getByRole("tab");
  const panelTitle = () => page.locator("[role=tabpanel]:not([hidden]) h3").textContent();
  await tabs.nth(0).scrollIntoViewIfNeeded();
  await tabs.nth(2).click();
  const afterClick = await panelTitle();
  await tabs.nth(2).focus();
  await page.keyboard.press("ArrowDown");
  const afterArrow = await panelTitle();
  await page.keyboard.press("End");
  const afterEnd = await panelTitle();
  await page.locator("[role=tabpanel]:not([hidden])").getByRole("button", { name: /^Next step/ }).click();
  const afterNext = await panelTitle();
  await page.locator("[role=tabpanel]:not([hidden])").getByRole("button", { name: /^Previous step/ }).click();
  const afterPrev = await panelTitle();
  const visiblePanels = await page.locator("[role=tabpanel]:not([hidden])").count();
  console.log(`[${name}] process click=${afterClick} arrow=${afterArrow} end=${afterEnd} next(wrap)=${afterNext} prev=${afterPrev} visiblePanels=${visiblePanels}`);

  await tabs.nth(1).click();
  await page.waitForTimeout(400);
  const process = page.locator("main > section").nth(4);
  await process.screenshot({ path: `tmp-audit/shots/cb-process-${name}.png` });
  const tabSizes = await tabs.evaluateAll((els) => els.map((e) => Math.round(Math.min(e.getBoundingClientRect().width, e.getBoundingClientRect().height))));
  console.log(`[${name}] min tab dimension`, Math.min(...tabSizes), "errors", errors.length);
  await page.close();
}
await browser.close();

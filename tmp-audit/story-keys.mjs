import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);
const tablist = page.locator('[role="tablist"][aria-label="Commercial production steps"]');
const state = () =>
  page.evaluate(() => {
    const list = document.querySelector('[role="tablist"][aria-label="Commercial production steps"]');
    const section = list.closest("section");
    const selected = list.querySelector('[aria-selected="true"]');
    const img = section.querySelector("figure img[alt]:not([alt=''])");
    return {
      selected: selected?.textContent,
      focused: document.activeElement?.textContent?.slice(0, 30),
      caption: section.querySelector("figcaption")?.textContent,
      image: img?.getAttribute("src"),
      visiblePanels: [...section.querySelectorAll('[role="tabpanel"]')].filter((p) => getComputedStyle(p).visibility === "visible").length,
    };
  });

await tablist.locator('[role="tab"]').first().focus();
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowRight");
console.log("after 2x ArrowRight", JSON.stringify(await state()));

const thumbs = page.locator('[aria-label="Footage frames"] button');
console.log("footage thumbs", await thumbs.count());
await thumbs.nth(2).click();
console.log("after thumb 3 click", JSON.stringify(await state()));
await page.keyboard.press("ArrowLeft");
console.log("after ArrowLeft in thumbs", JSON.stringify(await state()));

await tablist.locator('[role="tab"]').nth(2).focus();
await page.keyboard.press("End");
console.log("after End", JSON.stringify(await state()));
await page.keyboard.press("Home");
console.log("after Home", JSON.stringify(await state()));
console.log("page errors", errors.length ? errors : "none");
await browser.close();

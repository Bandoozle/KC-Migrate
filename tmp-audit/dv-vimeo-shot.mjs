import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("tmp-audit/dv-img", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("https://staging.kosick.com/connected-tv-advertising-canada/", { waitUntil: "domcontentloaded", timeout: 60000 });
const frame = page.locator("iframe[src*='vimeo']").first();
await frame.scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
const src = await frame.getAttribute("src");
console.log("src", src);
const box = await frame.boundingBox();
console.log("box", box);
if (box) {
  await page.screenshot({ path: "tmp-audit/dv-img/vimeo-frame.png", clip: box });
}
const child = page.frameLocator("iframe[src*='vimeo']");
const text = await child.locator("body").innerText().catch((error) => String(error));
console.log("frame text", text.slice(0, 500));
await browser.close();

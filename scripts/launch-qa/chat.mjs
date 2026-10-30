// Chat panel: closed = inert and unreachable by Tab; open = usable. No message is sent.
import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3107/contact/", { waitUntil: "load" });
const panel = page.locator(".aca-panel");
const closed = await panel.evaluate((el) => ({ inert: el.inert, hidden: el.getAttribute("aria-hidden") }));
let reached = false;
for (let i = 0; i < 80; i += 1) {
  await page.keyboard.press("Tab");
  if (await page.evaluate(() => Boolean(document.activeElement?.closest(".aca-panel")))) { reached = true; break; }
}
console.log(`${!reached && closed.inert ? "PASS" : "FAIL"}  Chat closed: inert=${closed.inert}, Tab reaches panel=${reached}`);
await page.locator(".aca-launcher, button[aria-label*='hat']").first().click();
await page.waitForTimeout(600);
const open = await panel.evaluate((el) => ({ inert: el.inert, hidden: el.getAttribute("aria-hidden"), visible: el.getBoundingClientRect().height > 0 }));
const input = page.locator(".aca-panel textarea, .aca-panel input[type='text']").first();
await input.focus();
const focused = await page.evaluate(() => Boolean(document.activeElement?.closest(".aca-panel")));
console.log(`${!open.inert && open.visible && focused ? "PASS" : "FAIL"}  Chat open: inert=${open.inert}, aria-hidden=${open.hidden}, input focusable=${focused}`);
await browser.close();

import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:3001/services/outdoor-advertising/billboard-dimensions/", {
  waitUntil: "domcontentloaded",
});
const reserve = page.getByRole("link", { name: "Reserve A Location" });
await reserve.waitFor();
const read = async (locator) =>
  locator.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      color: style.color,
      background: style.backgroundColor,
      border: style.borderTopColor,
      radius: style.borderRadius,
    };
  });
const rest = await read(reserve);
await reserve.hover();
const hover = await read(reserve);
await reserve.focus();
const focus = await read(reserve);
const guide = await page.locator("h2", { hasText: "Billboard dimensions in Canada" }).evaluate((node) => {
  const section = node.closest("section");
  return section?.innerText || "";
});
console.log(JSON.stringify({ rest, hover, focus, guide }, null, 2));
await browser.close();

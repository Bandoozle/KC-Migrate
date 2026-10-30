import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/services/digital-connected-tv/", { waitUntil: "load", timeout: 90000 });
const info = await page.evaluate(() => {
  const ids = ["dv-formats", "dv-target", "dv-partners"];
  return ids.map((id) => {
    const title = document.getElementById(id);
    const block = title.closest(".DigitalVideoAdvertisingPage-module__centered") || title.parentElement.parentElement;
    const lead = block.parentElement.querySelector("p:last-of-type") || block.querySelector("p.DigitalVideoAdvertisingPage-module__lead, p");
    const label = block.querySelector("p");
    const align = (el) => (el ? getComputedStyle(el).textAlign : null);
    return { id, title: align(title), label: align(label), lead: align(lead), leadText: lead?.textContent.trim().slice(0, 48) };
  });
});
console.log(JSON.stringify(info, null, 2));
for (const id of ["dv-formats", "dv-target", "dv-partners"]) {
  const heading = page.locator(`#${id}`);
  const block = heading.locator("xpath=ancestor::div[contains(@class,'centered')][1]");
  await block.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await block.screenshot({ path: `tmp-audit/shots/dv-center-${id}.png` });
}
await browser.close();

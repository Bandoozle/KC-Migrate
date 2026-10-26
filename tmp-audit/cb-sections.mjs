import { chromium } from "playwright";

const tag = process.argv[2] ?? "v1";
const widths = (process.argv[3] ?? "d").split(",");
const sizes = { d: [1440, 900], t: [768, 1024], m: [390, 844] };
const browser = await chromium.launch({ channel: "msedge" });
for (const name of widths) {
  const [width, height] = sizes[name];
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000/services/corporate-branding/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.addStyleTag({ content: "header, [class*='chat'], [class*='Chat'], nextjs-portal { visibility: hidden !important; }" });
  await page.waitForTimeout(800);
  const sections = page.locator("main > section");
  const count = await sections.count();
  const heights = [];
  for (let i = 0; i < count; i++) {
    const s = sections.nth(i);
    const box = await s.boundingBox();
    heights.push(Math.round(box.height));
    await s.screenshot({ path: `tmp-audit/shots/cb-${tag}-${name}-s${i}.png` });
  }
  console.log(name, "section heights", heights.join(", "));
  await page.close();
}
await browser.close();

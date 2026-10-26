import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [, , path = "/services/radio-advertising/", widthsArg = "1440", tag = "page"] = process.argv;
const widths = widthsArg.split(",").map(Number);
mkdirSync("tmp-audit/shots", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const res = await page.goto(`http://localhost:3001${path}`, { waitUntil: "networkidle", timeout: 120000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => ({
    h: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    h1: document.querySelectorAll("h1").length,
    sections: [...document.querySelectorAll("main > section")].map((s) => `${s.className.split(" ").slice(-1)[0]}:${Math.round(s.getBoundingClientRect().height)}`),
  }));
  const file = `tmp-audit/shots/${tag}-${width}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(width, res?.status(), JSON.stringify(info), errors.slice(0, 3));
  await page.close();
}
await browser.close();

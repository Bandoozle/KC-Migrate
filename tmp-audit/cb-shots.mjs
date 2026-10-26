import { chromium } from "playwright";

const tag = process.argv[2] ?? "before";
const browser = await chromium.launch({ channel: "msedge" });
for (const [name, width] of [["d", 1440], ["t", 768], ["m", 390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("http://localhost:3000/services/corporate-branding/", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `tmp-audit/shots/cb-${tag}-${name}.png`, fullPage: true });
  const info = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    height: document.body.scrollHeight,
    headings: [...document.querySelectorAll("main h1, main h2, main h3")].map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 70)}`),
    upper: [...document.querySelectorAll("main *")]
      .filter((el) => el.children.length === 0 && el.textContent.trim() && getComputedStyle(el).textTransform === "uppercase")
      .map((el) => el.textContent.trim().slice(0, 40)),
  }));
  console.log(`\n[${name}] overflow=${info.overflow} height=${info.height} errors=${errors.length} ${errors.slice(0, 3).join(" | ")}`);
  if (name === "d") console.log(info.headings.join("\n"));
  console.log("uppercase:", JSON.stringify(info.upper));
  await page.close();
}
await browser.close();

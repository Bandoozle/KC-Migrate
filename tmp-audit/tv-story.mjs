import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/television-advertising/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.locator("h1").waitFor({ timeout: 20000 });
const story = page.locator("section").filter({
  has: page.getByRole("heading", { name: "Compelling TV commercial production" }),
});
await story.scrollIntoViewIfNeeded();
await story.screenshot({ path: "tmp-audit/tv-page/story-1440.png" });
const faq = page.getByText("Absolutely. Our in-house creative team");
console.log("faq keeps absolutely", await faq.count());
await browser.close();

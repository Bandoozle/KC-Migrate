import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3001/services/search-engine-optimization/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForSelector("h1");
const text = await page.locator("article").innerText();
const needles = [
  "Keyword Research",
  "On-Page Optimization",
  "Link Building",
  "Local SEO",
  "Technical SEO",
  "Content Strategy",
  "Competitor Analysis",
  "Analytics",
  "Transparent monthly",
  "Return on investment",
  "Vancouver At",
  "For more than 40 years",
];
for (const needle of needles) console.log(`${text.includes(needle) ? "yes" : "NO "} ${needle}`);
await browser.close();

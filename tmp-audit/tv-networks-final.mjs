import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/television-advertising/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("h1").waitFor({ timeout: 20000 });
await page.locator("section[class*='networks']").screenshot({ path: "tmp-audit/tv-refine/networks-final.png" });
await browser.close();

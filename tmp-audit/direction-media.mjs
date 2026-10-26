import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
for (const route of ["/services/golf-marketing/", "/services/dental-marketing/"]) {
  await page.goto(`http://127.0.0.1:3001${route}`, { waitUntil: "domcontentloaded" });
  const data = await page.evaluate(() => {
    const heroImg = document.querySelector("main img");
    const iframes = [...document.querySelectorAll("iframe")].map((frame) => frame.getAttribute("src"));
    const articles = [...document.querySelectorAll("main article, main section")].length;
    return {
      hero: {
        src: heroImg?.getAttribute("src"),
        alt: heroImg?.getAttribute("alt"),
      },
      iframes,
    };
  });
  console.log(route, JSON.stringify(data, null, 2));
}
await browser.close();

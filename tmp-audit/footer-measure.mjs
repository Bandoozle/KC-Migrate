import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge" });
for (const width of [1440, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 90000 });
  const info = await page.evaluate(() => {
    const footer = document.querySelector("footer[role=contentinfo]");
    const logo = footer.querySelector("img");
    const blurb = footer.querySelector("p");
    const social = footer.querySelector("ul");
    const box = (el) => el.getBoundingClientRect();
    const logoBox = box(logo);
    const blurbBox = box(blurb);
    const socialBox = box(social);
    return {
      footerHeight: Math.round(footer.getBoundingClientRect().height),
      logoToBlurb: Math.round(blurbBox.top - logoBox.bottom),
      blurbToSocial: Math.round(socialBox.top - blurbBox.bottom),
      order: [...footer.querySelectorAll("img, p, nav h2, form, ul")].slice(0, 8).map((el) => el.tagName + ":" + (el.textContent || el.getAttribute("alt") || "").replace(/\s+/g, " ").trim().slice(0, 28)),
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  console.log(width, JSON.stringify(info), "errors", errors.length);
  await page.close();
}
await browser.close();

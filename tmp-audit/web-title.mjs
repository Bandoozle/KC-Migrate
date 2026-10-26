import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});

async function read(progress) {
  await page.evaluate((value) => {
    const track = document.querySelector("[class*='track']");
    const stage = track.querySelector("[class*='stage']");
    const stick = track.offsetHeight - stage.offsetHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + (value / 7) * stick);
  }, progress);
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const heading = [...document.querySelectorAll("h2")].find((node) =>
      node.textContent.includes("Our Latest Website Projects"),
    );
    const box = heading.getBoundingClientRect();
    const stage = document.querySelector("[class*='stage']");
    return {
      title: document.querySelector("[data-active='true'] h3")?.textContent?.trim(),
      heading: heading.textContent.trim(),
      headingTop: Math.round(box.top),
      headingBottom: Math.round(box.bottom),
      headingVisible: box.top >= 60 && box.bottom <= window.innerHeight,
      stageTop: Math.round(stage.getBoundingClientRect().top),
      h2count: [...document.querySelectorAll("h2")].filter((node) =>
        node.textContent.includes("Our Latest Website Projects"),
      ).length,
    };
  });
}

console.log("early", JSON.stringify(await read(0.4)));
await page.screenshot({ path: "tmp-audit/shots/web-title-early.png" });
console.log("mid", JSON.stringify(await read(3.2)));
await page.screenshot({ path: "tmp-audit/shots/web-title-mid.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3001/services/website-development/", {
  waitUntil: "networkidle",
  timeout: 120000,
});
await mobile.evaluate(() => {
  const heading = [...document.querySelectorAll("h2")].find((node) =>
    node.textContent.includes("Our Latest Website Projects"),
  );
  window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - 72);
});
await mobile.waitForTimeout(200);
const mobileRead = await mobile.evaluate(() => {
  const heading = [...document.querySelectorAll("h2")].find((node) =>
    node.textContent.includes("Our Latest Website Projects"),
  );
  const box = heading.getBoundingClientRect();
  return {
    headingTop: Math.round(box.top),
    h2count: [...document.querySelectorAll("h2")].filter((node) =>
      node.textContent.includes("Our Latest Website Projects"),
    ).length,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  };
});
await mobile.screenshot({ path: "tmp-audit/shots/web-title-mobile.png" });
console.log("mobile", JSON.stringify(mobileRead));
await browser.close();

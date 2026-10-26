import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/services/digital-connected-tv/", { waitUntil: "networkidle", timeout: 120000 });
const info = await page.evaluate(() => {
  const main = document.querySelector("main");
  return {
    sections: [...main.querySelectorAll("section")].map((section) => ({
      cls: section.className.slice(0, 80),
      text: section.innerText.replace(/\n{2,}/g, "\n").slice(0, 900),
    })),
  };
});
for (const section of info.sections) {
  console.log("\n====", section.cls);
  console.log(section.text);
}
await browser.close();

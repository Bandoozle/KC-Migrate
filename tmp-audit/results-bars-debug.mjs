import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (msg) => console.log("console", msg.type(), msg.text()));
page.on("pageerror", (error) => console.log("pageerror", error.message));
await page.goto("http://127.0.0.1:3001/marketing-results/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);
const before = await page.evaluate(() => {
  const section = document.getElementById("collection-heading")?.closest("section");
  const button = [...document.querySelectorAll("button")].find((node) => /load more/i.test(node.textContent || ""));
  return {
    projects: section?.querySelectorAll("[data-project]").length || 0,
    button: button?.textContent?.replace(/\s+/g, " ").trim() || null,
    reactKeys: button ? Object.keys(button).filter((key) => key.toLowerCase().includes("react")) : [],
    listeners: button ? typeof getEventListeners === "function" : false,
  };
});
console.log("before", before);
await page.evaluate(() => {
  const button = [...document.querySelectorAll("button")].find((node) => /load more/i.test(node.textContent || ""));
  button?.click();
});
await page.waitForTimeout(400);
const after = await page.evaluate(() => {
  const section = document.getElementById("collection-heading")?.closest("section");
  return {
    projects: [...(section?.querySelectorAll("[data-project]") || [])].map((node) => node.getAttribute("data-project")),
    button: [...document.querySelectorAll("button")].some((node) => /load more/i.test(node.textContent || "")),
  };
});
console.log("after", after);
await browser.close();

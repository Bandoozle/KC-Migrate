import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3011";
const outDir = path.resolve("tmp-audit/results-v2");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const notes = [];

async function settle(page) {
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const response = await page.goto(`${base}/marketing-results/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("h1").first().waitFor();
  await page.locator("[data-project]").first().waitFor();
  await settle(page);

  const metrics = await page.evaluate(() => {
    const panels = [...document.querySelectorAll(".stage, [class*='stage'] article, article[data-project]")];
    const featured = [...document.querySelectorAll("article[data-project]")].slice(0, 3);
    const tops = featured.map((node) => Math.round(node.getBoundingClientRect().top + window.scrollY));
    const title = document.querySelector("title")?.textContent || "";
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
    const jsonLd = document.querySelectorAll('script[type="application/ld+json"]').length;
    const h1 = [...document.querySelectorAll("h1")].map((node) => node.textContent?.replace(/\s+/g, " ").trim());
    const intro = document.body.innerText.includes("Delivering Universal Marketing Results");
    const directory = document.body.innerText.includes("Solutions in this work");
    const links = [...document.querySelectorAll("a")]
      .filter((node) => /discuss this work/i.test(node.textContent || ""))
      .map((node) => node.getAttribute("href"));
    const projects = [...document.querySelectorAll("[data-project]")].map((node) => node.getAttribute("data-project"));
    const hero = document.querySelector("h1")?.innerText?.replace(/\s+/g, " ").trim();
    const cta = [...document.querySelectorAll("h2")].map((node) => node.textContent?.replace(/\s+/g, " ").trim());
    return {
      title,
      canonical,
      jsonLd,
      h1,
      hero,
      intro,
      directory,
      discuss: [...new Set(links)],
      projects,
      tops,
      cta,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  await page.screenshot({ path: path.join(outDir, `full-${width}.png`), fullPage: true });
  await page.screenshot({ path: path.join(outDir, `stage-${width}.png`) });
  const stage = page.locator("article[data-project]").first();
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, `panels-${width}.png`) });

  notes.push({ width, status: response?.status(), ...metrics });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/marketing-results/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("[data-project]").first().waitFor();
await page.getByRole("button", { name: "Traditional", exact: true }).click();
await page.waitForTimeout(300);
const traditional = await page.locator("#collection-heading").locator("xpath=ancestor::section[1]").locator("[data-project]").evaluateAll((nodes) =>
  nodes.map((node) => node.getAttribute("data-project")),
);
await page.screenshot({ path: path.join(outDir, "filter-traditional-1440.png"), fullPage: true });
await page.getByRole("button", { name: "All", exact: true }).click();
await page.getByRole("button", { name: /Load more/i }).click();
await page.waitForTimeout(300);
const afterMore = await page.locator("[data-project]").evaluateAll((nodes) =>
  nodes.map((node) => node.getAttribute("data-project")),
);
const wealth = afterMore.includes("wealth-management");
await page.screenshot({ path: path.join(outDir, "loaded-1440.png"), fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${base}/marketing-results/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await mobile.locator("[data-project]").first().waitFor();
await mobile.getByRole("button", { name: "Digital Marketing", exact: true }).click();
await mobile.waitForTimeout(250);
const mobileFilter = await mobile.locator("#collection-heading").locator("xpath=ancestor::section[1]").locator("[data-project]").evaluateAll((nodes) =>
  nodes.map((node) => node.getAttribute("data-project")),
);
await mobile.screenshot({ path: path.join(outDir, "filter-digital-390.png"), fullPage: true });

notes.push({ traditional, afterMore, wealth, mobileFilter });
await browser.close();
console.log(JSON.stringify(notes, null, 2));

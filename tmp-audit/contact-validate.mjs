import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3011";
const outDir = path.resolve("tmp-audit/contact-redesign");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto(`${base}/contact/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("#contact-form").waitFor();
await page.waitForTimeout(800);

const seo = await page.evaluate(() => ({
  title: document.title,
  canonical: document.querySelector("link[rel='canonical']")?.getAttribute("href"),
  jsonLd: document.querySelectorAll("script[type='application/ld+json']").length,
  h1: document.querySelectorAll("h1").length,
}));

const requests = [];
page.on("request", (request) => {
  if (request.url().includes("admin-ajax") || request.url().includes("contact-form")) {
    requests.push({ url: request.url(), method: request.method() });
  }
});

await page.locator("#contact-form").scrollIntoViewIfNeeded();
await page.locator("#contact-form button[type='submit']").click();
await page.waitForTimeout(900);
const empty = await page.evaluate(() => ({
  url: location.pathname,
  alerts: [...document.querySelectorAll("[role='alert']")].map((node) => node.textContent.trim()),
  invalid: [...document.querySelectorAll("[aria-invalid='true']")].map((node) => node.getAttribute("name")),
}));
await page.screenshot({ path: path.join(outDir, "contact-validation.png") });

await page.locator("#contact-form input[autocomplete='name']").fill("Layout check");
await page.locator("#contact-form input[type='email']").fill("not-an-email");
await page.locator("#contact-form input[type='tel']").fill("6045550100");
await page.locator("#contact-form button[type='submit']").click();
await page.waitForTimeout(900);
const email = await page.evaluate(() => ({
  url: location.pathname,
  alerts: [...document.querySelectorAll("[role='alert']")].map((node) => node.textContent.trim()),
}));

const name = page.locator("#contact-form input[autocomplete='name']");
await name.focus();
const focus = await name.evaluate((node) => {
  const style = getComputedStyle(node);
  return { outline: style.outlineStyle, outlineWidth: style.outlineWidth, borderColor: style.borderColor };
});

await page.keyboard.press("Tab");
const tabbed = await page.evaluate(() => document.activeElement?.getAttribute("name") || document.activeElement?.tagName);

console.log(JSON.stringify({ seo, empty, email, focus, tabbed, requests }, null, 2));
await browser.close();

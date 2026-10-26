import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:3001";
const outDir = path.resolve("tmp-audit/contact-redesign");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const notes = [];

for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 1200 } });
  await page.goto(`${base}/contact/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#contact-studio-title").waitFor({ timeout: 20000 });
  await page.waitForTimeout(600);
  const measure = await page.evaluate(() => {
    const shell = document.querySelector("[class*='shell']");
    const panel = document.querySelector("[class*='panel']");
    const formPane = document.getElementById("contact-form");
    const shellBox = shell.getBoundingClientRect();
    const panelBox = panel.getBoundingClientRect();
    const formBox = formPane.getBoundingClientRect();
    const footer = document.querySelector("footer");
    const footerBox = footer?.getBoundingClientRect();
    const map = document.querySelector("[class*='mapImage']");
    const globe = [...document.querySelectorAll("img")].filter((img) => /global/i.test(img.getAttribute("src") || ""));
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll("h1").length,
      h1Text: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
      shell: { w: Math.round(shellBox.width), h: Math.round(shellBox.height) },
      panel: { w: Math.round(panelBox.width), h: Math.round(panelBox.height), top: Math.round(panelBox.top) },
      form: { w: Math.round(formBox.width), h: Math.round(formBox.height), top: Math.round(formBox.top) },
      stacked: Math.abs(formBox.top - panelBox.bottom) < 4 || formBox.top >= panelBox.bottom - 2,
      sideBySide: Math.abs(panelBox.top - formBox.top) < 3 && formBox.left > panelBox.left,
      ratio: Math.round((panelBox.width / shellBox.width) * 100),
      offices: [...document.querySelectorAll("[class*='officeLabel']")].map((node) => node.textContent.trim()),
      addressLines: [...document.querySelectorAll("[class*='officeAddress'] span")].map((node) => node.textContent.trim()),
      links: [...document.querySelectorAll("[class*='panel'] a")].map((node) => ({
        text: node.textContent.replace(/\s+/g, " ").trim(),
        href: node.getAttribute("href"),
      })),
      labels: [...document.querySelectorAll("#contact-form label")].map((node) => node.textContent.replace(/\s+/g, " ").trim()),
      inputs: [...document.querySelectorAll("#contact-form input, #contact-form textarea")].map((node) => ({
        name: node.getAttribute("name"),
        type: node.getAttribute("type") || node.tagName.toLowerCase(),
      })),
      decorativeMap: Boolean(map),
      globeInStudio: globe.some((img) => img.closest("[class*='shell']")),
      footerGap: footerBox ? Math.round(footerBox.top - formBox.bottom) : null,
      radius: getComputedStyle(shell).borderRadius,
    };
  });
  await page.screenshot({ path: path.join(outDir, `contact-${width}.png`), fullPage: true });
  notes.push({ width, ...measure });
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto(`${base}/contact/`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.locator("#contact-form").waitFor();
await page.waitForTimeout(500);
await page.locator("#contact-form").scrollIntoViewIfNeeded();
const name = page.locator("#contact-form input[autocomplete='name']");
await name.focus();
const focus = await name.evaluate((node) => {
  const style = getComputedStyle(node);
  return { outline: style.outline, border: style.borderColor };
});
await page.locator("#contact-form button[type='submit']").click();
await page.waitForTimeout(800);
const validation = await page.evaluate(() => ({
  url: location.pathname,
  alerts: [...document.querySelectorAll("[role='alert']")].map((node) => node.textContent.trim()),
  invalid: document.querySelectorAll("[aria-invalid='true']").length,
}));
await page.screenshot({ path: path.join(outDir, "contact-validation.png") });
await name.fill("Playwright Check");
await page.locator("#contact-form input[type='email']").fill("not-an-email");
await page.locator("#contact-form input[type='tel']").fill("6045550100");
await page.locator("#contact-form button[type='submit']").click();
await page.waitForTimeout(800);
const emailCheck = await page.evaluate(() => ({
  url: location.pathname,
  alerts: [...document.querySelectorAll("[role='alert']")].map((node) => node.textContent.trim()),
}));
notes.push({ focus, validation, emailCheck });
await browser.close();
console.log(JSON.stringify(notes, null, 2));

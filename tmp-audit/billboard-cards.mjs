import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("tmp-audit/billboard-cards");
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

function parseRgb(value) {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function luminance([r, g, b]) {
  const channel = (value) => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  const [rs, gs, bs] = [r, g, b].map(channel);
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const notes = [];
for (const width of [390, 768, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 1200 } });
  await page.goto("http://127.0.0.1:3001/services/outdoor-advertising/billboard-dimensions/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.locator("h2", { hasText: "Billboard dimensions in Canada" }).waitFor();
  await page.waitForTimeout(700);
  const info = await page.evaluate(() => {
    const cards = [...document.querySelectorAll("main article")].map((card) => {
      const image = card.querySelector("img")?.getBoundingClientRect();
      const body = card.querySelector("p:last-of-type");
      const button = card.querySelector("a");
      const buttonStyle = button ? getComputedStyle(button) : null;
      return {
        title: card.querySelector("h3")?.textContent?.trim(),
        dimension: card.querySelector("p")?.textContent?.trim(),
        w: Math.round(card.getBoundingClientRect().width),
        h: Math.round(card.getBoundingClientRect().height),
        radius: getComputedStyle(card).borderRadius,
        image: image ? { w: Math.round(image.width), h: Math.round(image.height) } : null,
        bodySize: body ? getComputedStyle(body).fontSize : null,
        bodyColor: body ? getComputedStyle(body).color : null,
        button: button
          ? {
              text: button.textContent?.trim(),
              color: buttonStyle.color,
              background: buttonStyle.backgroundColor,
              border: buttonStyle.borderTopColor,
              radius: buttonStyle.borderRadius,
            }
          : null,
      };
    });
    const introButton = document.querySelector("main section a");
    const introStyle = introButton ? getComputedStyle(introButton) : null;
    const text = document.querySelector("main section")?.innerText || "";
    return {
      h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
      jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      compareBoxes: document.querySelectorAll("main nav").length,
      lead: document.querySelector("main section p")?.textContent?.trim(),
      hasVancouver: text.includes("Vancouver"),
      hasBreakdown: /breakdown/i.test(text),
      hasHighway: /highway/i.test(text),
      hasViewing: /viewing distance/i.test(text),
      hasNeighborhood: /neighborhood/i.test(text),
      cards,
      introButton: introButton
        ? {
            text: introButton.textContent?.trim(),
            color: introStyle.color,
            background: introStyle.backgroundColor,
            radius: introStyle.borderRadius,
          }
        : null,
    };
  });
  const scored = ["intro", ...info.cards.map((card) => card.title)].map((label, index) => {
    const button = index === 0 ? info.introButton : info.cards[index - 1].button;
    if (!button) return { label, contrast: null };
    const fg = parseRgb(button.color);
    const bg = parseRgb(button.background);
    return {
      label,
      contrast: fg && bg ? Number(contrast(fg, bg).toFixed(2)) : null,
      color: button.color,
      background: button.background,
    };
  });
  await page.screenshot({ path: path.join(outDir, `sizes-${width}.png`), fullPage: true });
  notes.push({ width, ...info, contrast: scored });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(notes, null, 2));

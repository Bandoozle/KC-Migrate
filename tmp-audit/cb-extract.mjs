import fs from "fs";
import { chromium } from "playwright";

const res = await fetch("https://staging.kosick.com/wp-json/wp/v2/pages?slug=corporate-branding&_fields=id,content,title");
const pages = await res.json();
fs.writeFileSync("tmp-audit/cb-page.json", JSON.stringify(pages));
const html = pages[0].content.rendered;
const imgs = [...html.matchAll(/<img[^>]+>/g)].map((m) => {
  const tag = m[0];
  return { src: tag.match(/src="([^"]+)"/)?.[1] ?? "", alt: tag.match(/alt="([^"]*)"/)?.[1] ?? "", w: tag.match(/width="(\d+)"/)?.[1], h: tag.match(/height="(\d+)"/)?.[1] };
});
const bg = [...html.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1]);
const links = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => `${m[2].replace(/<[^>]+>/g, "").trim()} -> ${m[1]}`);
const text = html
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<style[\s\S]*?<\/style>/g, "")
  .replace(/<[^>]+>/g, "\n")
  .replace(/&amp;/g, "&")
  .replace(/&nbsp;/g, " ")
  .replace(/&#8217;|&#8216;/g, "'")
  .replace(/&#8220;|&#8221;/g, '"')
  .replace(/&[a-z#0-9]+;/g, " ")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);
console.log(text.join("\n"));
console.log("\n--- IMAGES ---");
for (const i of imgs) console.log(`${i.alt} | ${i.src} | ${i.w}x${i.h}`);
console.log("\n--- BG ---\n" + bg.join("\n"));
console.log("\n--- LINKS ---\n" + links.join("\n"));

const browser = await chromium.launch({ channel: "msedge" });
for (const [name, width] of [["d", 1440], ["m", 390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3000/services/corporate-branding/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `tmp-audit/shots/cb-before-${name}.png`, fullPage: true });
  const outline = await page.evaluate(() =>
    [...document.querySelectorAll("main h1, main h2, main h3, main h4")].map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 80)}`),
  );
  if (name === "d") console.log("\n--- RENDERED HEADINGS ---\n" + outline.join("\n"));
  await page.close();
}
await browser.close();

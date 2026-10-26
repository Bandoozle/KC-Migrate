import { chromium } from "playwright";

const shots = [
  ["/services/television-advertising/", "Connect with Canada"],
  ["/services/television-advertising/", "Television Advertising & Media Buying"],
  ["/services/television-advertising/", "Frequently Asked Questions"],
  ["/services/creative/", "Creative & Production"],
  ["/services/hvac-marketing/", "Full-Service HVAC Marketing"],
  ["/services/hvac-marketing/hvac-lead-generation/", "A multi-channel approach"],
  ["/services/hvac-marketing/hvac-lead-generation/", "Connected marketing creates"],
  ["/services/email-marketing/", "Smarter Email Marketing"],
  ["/services/email-marketing/", "Automate your customer journey"],
  ["/services/email-marketing/", "Analytics & optimization"],
  ["/services/search-engine-optimization/", "Search engine optimization (SEO)"],
  ["/corporate-events/", "Corporate Events"],
  ["/services/digital-marketing/", "Digital Marketing Campaigns"],
  ["/services/", null],
  ["/marketing-results/", null],
];

const width = Number(process.argv[2] || 1440);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 1000 } });
let n = 0;
for (const [path, heading] of shots) {
  n++;
  await page.goto(`http://localhost:3001${path}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(600);
  const box = await page.evaluate((text) => {
    const el = text
      ? [...document.querySelectorAll("h1,h2")].find((h) => h.textContent.replace(/\s+/g, " ").includes(text))
      : document.querySelector("h1");
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    const section = el.closest("section") || el.parentElement;
    const s = section.getBoundingClientRect();
    const h = el.getBoundingClientRect();
    const prev = el.previousElementSibling;
    return {
      y: Math.max(0, s.top + window.scrollY),
      gapAboveHeading: Math.round(h.top - s.top),
      prev: prev ? `${prev.tagName} ${prev.className.toString().slice(0, 40)}` : "-",
      sectionHeight: Math.round(s.height),
    };
  }, heading);
  if (!box) {
    console.log(n, path, heading, "NOT FOUND");
    continue;
  }
  console.log(n, path, heading, JSON.stringify(box));
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: `tmp-audit/eb-${width}-${n}.png`,
    fullPage: true,
    clip: { x: 0, y: box.y, width, height: Math.min(700, box.sectionHeight) },
  });
}
await browser.close();

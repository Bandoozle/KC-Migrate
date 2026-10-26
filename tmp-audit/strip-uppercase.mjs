import { readFileSync, writeFileSync } from "node:fs";

const targets = {
  "src/components/sections/MarketingResultsPortfolio.module.css": [88],
  "src/components/sections/SeoMarketingPage.module.css": [228, 277],
  "src/components/contact/ContactPageView.module.css": [47, 91, 137],
  "src/components/contact/ContactForm.module.css": [140],
  "src/components/sections/television/TelevisionAdvertisingPage.module.css": [62],
  "src/components/sections/HeroBanner.module.css": [91, 172],
  "src/components/sections/email-marketing/EmailMarketingPage.module.css": [331],
  "src/components/sections/OutdoorAdvertisingPage.module.css": [140],
  "src/components/sections/EditorialColumns.module.css": [86],
  "src/components/sections/GolfMarketingPage.module.css": [19],
  "src/components/sections/DentalMarketingPage.module.css": [40],
  "src/styles/kosick-design-system.css": [203],
};

for (const [file, lineNumbers] of Object.entries(targets)) {
  const eol = readFileSync(file, "utf8").includes("\r\n") ? "\r\n" : "\n";
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (const n of [...lineNumbers].sort((a, b) => b - a)) {
    const i = n - 1;
    if (!/text-transform:\s*uppercase/.test(lines[i])) throw new Error(`${file}:${n} is "${lines[i]}"`);
    let j = i;
    while (j > 0 && !lines[j].includes("{")) j--;
    for (let k = j; k < i; k++) {
      if (/letter-spacing:\s*0\.\d+em;/.test(lines[k])) {
        lines[k] = lines[k].replace(/letter-spacing:\s*0\.\d+em;/, "letter-spacing: var(--kosick-eyebrow-tracking);");
      }
    }
    lines.splice(i, 1);
  }
  writeFileSync(file, lines.join(eol), "utf8");
  console.log("ok", file);
}

import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("tmp-parity/digital-marketing.html", "utf8");

// Rough section markers from known structure
const markers = [
  "What We offer",
  "Digital Marketing Campaigns",
  "Meta Ads",
  "REACH NEW CUSTOMERS",
  "Connect With Your Audience",
  "Google Ads management",
  "Decide Where to Advertise",
  "PPC SEARCH CAMPAIGNS",
  "Track Digital Marketing Results",
  "How quickly will I see results",
  "Ready to Elevate Your Digital Marketing",
];

console.log("=== marker presence ===");
for (const m of markers) {
  console.log((html.includes(m) ? "Y" : "N"), m);
}

const entry = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
const rows = [...entry.matchAll(/kb-row-layout-id([\w_-]+)/g)].map((m) => m[1]);
console.log("\n=== unique row ids (first 40) ===");
console.log([...new Set(rows)].slice(0, 40).join("\n"));

const imgs = [...entry.matchAll(/src="(https:\/\/staging\.kosick\.com\/wp-content\/uploads\/[^"]+)"/g)].map(
  (m) => m[1],
);
console.log("\n=== unique images count ===", new Set(imgs).size);
console.log([...new Set(imgs)].slice(0, 25).join("\n"));

// FAQ accordion titles
const faqs = [...entry.matchAll(/kt-blocks-accordion-title[^>]*>([^<]+)/g)].map((m) =>
  m[1].trim(),
);
console.log("\n=== FAQs ===");
console.log(faqs.join("\n"));

writeFileSync(
  "scripts/tmp-dm-inventory.json",
  JSON.stringify(
    {
      rowIds: [...new Set(rows)],
      images: [...new Set(imgs)],
      faqs,
    },
    null,
    2,
  ),
);

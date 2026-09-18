import { readFileSync } from "node:fs";

const h = readFileSync("tmp-parity/rest/corporate-events.native.html", "utf8");

for (const needle of ["entry-content", "smartslider", "n2-ss-", "WordPressShell", "WordPressStyles"]) {
  const idx = h.indexOf(needle);
  if (idx < 0) {
    console.log(needle, "NOT FOUND");
    continue;
  }
  console.log("\n===", needle, "===");
  console.log(h.slice(Math.max(0, idx - 100), idx + 140).replace(/\s+/g, " "));
}

// Ensure main content structure
const mainIdx = h.indexOf("<main");
console.log("\nmain snippet:", h.slice(mainIdx, mainIdx + 400).replace(/\s+/g, " ").slice(0, 350));

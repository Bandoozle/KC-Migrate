import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("tmp-audit/seo-compare.json", "utf8"));
console.log("count", data.count, "mismatches", data.mismatches.length);
for (const row of data.mismatches) {
  console.log("\n" + row.path, "status", row.localStatus);
  if (!row.title) console.log("  title local:", row.localTitle, "\n  title live:", row.liveTitle);
  if (!row.description) {
    console.log("  desc local:", row.localDescription);
    console.log("  desc live:", row.liveDescription);
  }
  if (!row.canonical) console.log("  canon local:", row.localCanonical, "\n  canon live:", row.liveCanonical);
}

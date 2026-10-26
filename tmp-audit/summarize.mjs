import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync(new URL("./preview-follow.json", import.meta.url), "utf8"));
const byStatus = {};
for (const row of rows) {
  const key = String(row.status);
  byStatus[key] = (byStatus[key] || 0) + 1;
}
const bad = rows.filter((row) => row.status !== 200);
const noCanon = rows.filter((row) => row.status === 200 && !row.canonical);
const gtm = rows.filter((row) => row.gtm);
const generic = rows.filter((row) => row.title === "Kosick Communications");
const staging = rows
  .filter((row) => row.staging)
  .map((row) => ({ path: row.path, staging: row.staging }))
  .sort((a, b) => b.staging - a.staging)
  .slice(0, 12);
console.log("count", rows.length, byStatus);
console.log("non200", bad.map((row) => `${row.status} ${row.path}`).join("\n"));
console.log("gtm pages", gtm.length);
console.log("no canonical", noCanon.length);
console.log("generic title", generic.map((row) => row.path).join(", "));
console.log("top staging", staging);
const articles = rows.filter((row) => row.canonical);
console.log("canonical sample", articles.slice(0, 5));

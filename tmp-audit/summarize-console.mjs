import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync("tmp-audit/visual/console-errors.json", "utf8"));
const counts = new Map();
for (const row of rows) {
  const key = `${row.label} | ${row.message.slice(0, 180)}`;
  counts.set(key, (counts.get(key) || 0) + 1);
}
const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
console.log("total", rows.length, "unique", sorted.length);
for (const [key, count] of sorted.slice(0, 40)) console.log(count, key);

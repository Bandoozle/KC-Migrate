import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync(new URL("./preview-follow.json", import.meta.url), "utf8"));
const multi = rows.filter((row) => row.h1 > 1).map((row) => `${row.h1} ${row.path}`);
console.log("multi h1", multi.join("\n") || "none");
const slow = rows.filter((row) => row.ms > 4000).length;
console.log("over 4s", slow, "max", Math.max(...rows.map((r) => r.ms || 0)));

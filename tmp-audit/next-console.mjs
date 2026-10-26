import fs from "node:fs";
const rows = JSON.parse(fs.readFileSync("tmp-audit/visual/console-errors.json", "utf8"));
for (const row of rows.filter((item) => item.label === "next")) {
  console.log(row.viewport, row.page);
  console.log(row.message);
  console.log("---");
}

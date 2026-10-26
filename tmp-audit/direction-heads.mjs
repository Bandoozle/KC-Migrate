import { readFile } from "node:fs/promises";
const data = JSON.parse(await readFile("tmp-audit/direction/pages.json", "utf8"));
for (const [route, page] of Object.entries(data.pages)) {
  const heads = page.headings.filter((h) => h.tag !== "H3").map((h) => h.text).join(" | ");
  console.log(`\n${route}\n${heads}`);
}

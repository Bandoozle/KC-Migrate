import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const path =
  "c:/Users/smarc/.cursor/projects/c-Users-smarc-OneDrive-Desktop-Projects-Kosick-Website/attachments/f0d4d1a1-721a-40fa-923b-729ad08f1cdd/Kosick_site_audit.pdf";

const parser = new PDFParse({ data: fs.readFileSync(path) });
const result = await parser.getText();
let out = "";
for (const page of result.pages) {
  out += `\n\n========== PAGE ${page.num} ==========\n\n`;
  out += page.text;
}
fs.writeFileSync("tmp-audit/kosick-site-audit-text.txt", out, "utf8");
console.log(out);
await parser.destroy();

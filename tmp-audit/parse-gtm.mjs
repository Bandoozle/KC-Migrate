import { readFileSync } from "node:fs";

const js = readFileSync("tmp-audit/gtm.js", "utf8");
const marker = js.indexOf('"resource"');
const brace = js.indexOf("{", marker);
let depth = 0;
let end = brace;
let inString = false;
let escaped = false;
for (let i = brace; i < js.length; i += 1) {
  const char = js[i];
  if (inString) {
    if (escaped) escaped = false;
    else if (char === "\\") escaped = true;
    else if (char === '"') inString = false;
    continue;
  }
  if (char === '"') {
    inString = true;
    continue;
  }
  if (char === "{") depth += 1;
  else if (char === "}") {
    depth -= 1;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
const resource = JSON.parse(js.slice(brace, end));
console.log("HTML TAG", resource.tags[15].vtp_html);
console.log("\nADS LEAD TAG", JSON.stringify(resource.tags[2], null, 2).slice(0, 1500));
console.log("\nGA4 LEAD TAG", JSON.stringify(resource.tags[5], null, 2).slice(0, 1500));
console.log("\nMACROS");
resource.macros.forEach((macro, index) => console.log(index, JSON.stringify(macro).slice(0, 400)));

const contact = await (await fetch("https://staging.kosick.com/contact/")).text();
const index = contact.indexOf("kosick_contact_lead");
console.log("\ncontact kosick_contact_lead", index);
if (index >= 0) console.log(contact.slice(index - 400, index + 500).replace(/\s+/g, " "));

import { readFileSync } from "node:fs";

const h = readFileSync("tmp-parity/rest/contact.native.html", "utf8");

for (const needle of [
  "_kb_adv_form_post_id",
  "kb-advanced-form",
  "kb-row-layout-wrap",
  "formKey",
  "ContactForm",
]) {
  const idx = h.indexOf(needle);
  console.log("\n===", needle, idx >= 0 ? "FOUND" : "NO");
  if (idx >= 0) {
    console.log(h.slice(Math.max(0, idx - 60), idx + 100).replace(/\s+/g, " "));
  }
}

console.log("\nbody", (h.match(/<body[^>]*>/) || [])[0]);
console.log("main", (h.match(/<main[^>]*>/) || [])[0]);
console.log("has video/form inputs", /name="field652327-6b"/.test(h));

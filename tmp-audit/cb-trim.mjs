import fs from "node:fs";
const file = "src/components/sections/corporate-branding/CorporateBrandingPage.module.css";
let css = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

function cut(from, to, replacement = "") {
  const a = css.indexOf(from);
  const b = css.indexOf(to, a + 1);
  if (a < 0 || b < 0) throw new Error(`missing: ${from.slice(0, 30)} -> ${to.slice(0, 30)}`);
  css = css.slice(0, a) + replacement + css.slice(b);
}
function replace(from, to) {
  if (!css.includes(from)) throw new Error(`missing: ${from.slice(0, 40)}`);
  css = css.replace(from, to);
}

replace(".page a.primary,\n.page a.secondary,\n.page a.dark {", ".page a.dark {");
cut(".page a.primary {\n", ".page a.dark {\n");
cut(".hero a:focus-visible {", ".page a:focus-visible {");
cut("/* Hero: the headline", "/* Intro:");
replace("  .heroGrid,\n  .introGrid {", "  .introGrid {");
replace("  .hero .heroTitle {\n    max-width: 12ch;\n  }\n\n", "");
cut("  .collage {\n    aspect-ratio: auto;", "  .billboardFrame {\n    aspect-ratio: 1 / 1;");
replace("  .collageMain,\n  .collageInset,\n  .collageDrift {\n    animation: none;\n  }\n\n", "");
replace("  .page a.primary,\n  .page a.secondary,\n  .page a.dark,", "  .page a.dark,");

fs.writeFileSync(file, css);
const left = css.match(/\.(hero\w*|collage\w*|actions|primary|secondary)\b|settle|drift/g);
console.log("leftovers:", left);

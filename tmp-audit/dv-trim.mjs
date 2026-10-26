import fs from "node:fs";
const file = "src/components/sections/digital-video/DigitalVideoAdvertisingPage.module.css";
let css = fs.readFileSync(file, "utf8");
const start = css.indexOf(".hero {\n");
const end = css.indexOf(".note,\n.reportNote {");
if (start < 0 || end < 0) throw new Error(`markers not found ${start} ${end}`);
css = css.slice(0, start) + ".shot {\n  object-fit: cover;\n}\n\n.reportNote {" + css.slice(end + ".note,\n.reportNote {".length);
fs.writeFileSync(file, css);
console.log("trimmed", end - start, "chars");

import { readFileSync, writeFileSync } from "node:fs";

const file = "src/components/sections/television/TelevisionAdvertisingPage.module.css";
const css = readFileSync(file, "utf8");
const start = css.indexOf(".monitor {");
const end = css.indexOf(".points {");
if (start < 0 || end < start) throw new Error("markers not found");
const monitor = `.monitor {
  position: relative;
  align-self: start;
  aspect-ratio: 16 / 9;
  container-type: inline-size;
  background: #000000;
  color: #ffffff;
  overflow: hidden;
  border-radius: 4px;
}

`;
writeFileSync(file, css.slice(0, start) + monitor + css.slice(end), "utf8");
console.log("trimmed", end - start, "chars");

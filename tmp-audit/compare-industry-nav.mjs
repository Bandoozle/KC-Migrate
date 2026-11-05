import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "src/lib/industries";
const navSrc = readFileSync(join(dir, "nav.ts"), "utf8");
const indexSrc = readFileSync(join(dir, "index.ts"), "utf8");

const links = [...navSrc.matchAll(/\{\s*label:\s*"([^"]+)",\s*href:\s*"([^"]+)"\s*\}/g)].map(
  (m) => ({ label: m[1], href: m[2] }),
);

const order = [...indexSrc.matchAll(/^\s+([A-Z_]+),?\s*$/gm)]
  .map((m) => m[1])
  .filter((n) => !["INDUSTRIES", "INDUSTRY_LINKS"].includes(n) && n === n.toUpperCase());

const fileByExport = {};
for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "nav.ts" && f !== "types.ts" && f !== "metadata.ts")) {
  const src = readFileSync(join(dir, file), "utf8");
  const exp = src.match(/export const ([A-Z_]+)/)?.[1];
  const name = src.match(/name:\s*"([^"]+)"/)?.[1];
  const path = src.match(/path:\s*"([^"]+)"/)?.[1];
  if (exp) fileByExport[exp] = { file, name, path };
}

console.log("INDUSTRIES order from index:", order);
console.log("nav links:", links.length);
order.forEach((exp, i) => {
  const ind = fileByExport[exp];
  const link = links[i];
  const ok = ind && link && ind.name === link.label && ind.path === link.href;
  console.log(
    i,
    ok ? "OK" : "MISMATCH",
    exp,
    ind ? `${JSON.stringify(ind.name)} ${ind.path}` : "MISSING",
    "vs",
    link ? `${JSON.stringify(link.label)} ${link.href}` : "MISSING",
  );
});
console.log("length match", order.length === links.length);

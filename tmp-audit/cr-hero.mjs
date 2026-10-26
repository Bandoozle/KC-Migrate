import fs from "node:fs";
const file = "src/components/sections/creative/CreativeProductionPage.tsx";
let src = fs.readFileSync(file, "utf8");
const a = src.indexOf("      {/* Hero:");
const b = src.indexOf("      {/* Capabilities:");
if (a < 0 || b < 0) throw new Error("markers");
src = src.slice(0, a) + "      <ServiceHero title={content.title} hero={hero} />\n\n" + src.slice(b);
src = src.replace("  const steps = content.processSection?.steps ?? [];\n", "");
src = src.replace(
  'import { PageCta } from "@/components/sections/PageCta";\n',
  'import { PageCta } from "@/components/sections/PageCta";\nimport { ServiceHero } from "@/components/sections/ServiceHero";\n',
);
fs.writeFileSync(file, src);
console.log("ok");

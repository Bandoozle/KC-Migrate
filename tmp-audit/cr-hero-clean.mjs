import fs from "node:fs";

function edit(file, fn) {
  const before = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const after = fn(before);
  fs.writeFileSync(file, after);
}
function cutBetween(src, from, to) {
  const a = src.indexOf(from);
  const b = src.indexOf(to, a + 1);
  if (a < 0 || b < 0) throw new Error(`missing ${from.slice(0, 40)} -> ${to.slice(0, 40)}`);
  return src.slice(0, a) + src.slice(b);
}
function must(src, from, to) {
  if (!src.includes(from)) throw new Error(`missing ${from.slice(0, 50)}`);
  return src.replace(from, to);
}

edit("src/components/sections/creative/CreativeProductionPage.tsx", (s) => {
  s = must(s, 'import Link from "next/link";\n', "");
  s = must(s, "import { PageTitle, SectionTitle }", "import { SectionTitle }");
  s = must(s, 'import { AmbientReel, ReelPlayer } from "./ReelPlayer";', 'import { ReelPlayer } from "./ReelPlayer";');
  s = must(s, '  aerial: { src: `${UPLOADS}/2023/06/KC-Mov-3.mp4`, poster: "/images/creative/reel-aerial.jpg" },\n', "");
  s = cutBetween(s, "function ArrowIcon() {", "function sentence(");
  return s;
});

edit("src/components/sections/creative/ReelPlayer.tsx", (s) => {
  s = must(s, 'import { useEffect, useRef, useState } from "react";\nimport { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";\n', 'import { useRef, useState } from "react";\n');
  s = cutBetween(s, "function PauseIcon() {", "type ReelPlayerProps");
  const at = s.indexOf("type AmbientReelProps");
  if (at < 0) throw new Error("ambient");
  return s.slice(0, at).trimEnd() + "\n";
});

edit("src/components/sections/creative/ReelPlayer.module.css", (s) => {
  s = cutBetween(s, ".toggle {", "@media (prefers-reduced-motion: reduce)");
  return s;
});

edit("src/components/sections/creative/CreativeProductionPage.module.css", (s) => {
  s = cutBetween(s, ".caption,\n.captionOnDark {", ".captionOnDark {\n  color");
  s = must(s, ".captionOnDark {\n  color", ".captionOnDark {\n  margin-top: 0.85rem;\n  font-size: var(--kosick-meta-size);\n  line-height: var(--kosick-meta-leading);\n  color");
  s = cutBetween(s, "/*\n  `.kosick-native-page a", "/* Capability selector */");
  s = must(s, "  .heroGrid,\n  .renderHead,", "  .renderHead,");
  s = must(s, "  .path {\n    grid-template-columns: 1fr;\n    gap: 1rem;\n  }\n\n", "");
  s = must(s, "  .pathSteps {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    row-gap: 1rem;\n  }\n\n", "");
  return s;
});

fs.rmSync("public/images/creative/reel-aerial.jpg");
const css = fs.readFileSync("src/components/sections/creative/CreativeProductionPage.module.css", "utf8");
console.log("leftovers:", css.match(/\.(hero\w*|path\w*|actions|primary|secondary|caption)\b/g));

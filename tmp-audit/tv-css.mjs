import fs from "node:fs";
const file = "src/components/sections/television/TelevisionAdvertisingPage.module.css";
let css = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

function cut(from, to, replacement = "") {
  const a = css.indexOf(from);
  const b = css.indexOf(to, a + 1);
  if (a < 0 || b < 0) throw new Error(`missing: ${from.slice(0, 30)} -> ${to.slice(0, 30)}`);
  css = css.slice(0, a) + replacement + css.slice(b);
}

const reel = `.reelIntro {`;
const after = `.reelPoints,\n.points,\n.networkList {`;
cut(reel, after, `.reelTitle {
  max-width: 16ch;
  color: #ffffff;
  text-wrap: balance;
}

.screen {
  margin: 0;
}

.video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000000;
  border-radius: 6px;
}

.reelCopy {
  display: grid;
  gap: 1.25rem;
  margin: clamp(2rem, 4vw, 3rem) 0 clamp(2.25rem, 4vw, 3.25rem);
}

.reelLead {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.reelBody {
  margin: 0;
  max-width: 44ch;
  color: rgba(255, 255, 255, 0.78);
  font-size: var(--kosick-section-desc-size);
  line-height: var(--kosick-section-desc-leading);
}

.page a.light {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 50px;
  margin-top: 1.5rem;
  padding: 0.8rem 1.45rem;
  border: 1px solid #ffffff;
  border-radius: 999px;
  background: #ffffff;
  color: #101010;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.page a.light:hover {
  background: #e4e4e8;
  border-color: #e4e4e8;
}

.reel a.light:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}

`);

// The numbered list rules go; .points and .networkList keep their reset.
css = css.replace(`.reelPoints,\n.points,\n.networkList {`, `.points,\n.networkList {`);
cut(".reelPoints {\n", "\n.reelPoints span:last-child::before {");
const pointsBefore = css.indexOf(".reelPoints span:last-child::before {");
const end = css.indexOf("}\n", pointsBefore) + 2;
css = css.slice(0, pointsBefore) + css.slice(end);

cut("  .reelCopy {\n    grid-template-columns: minmax(0, 1.05fr)", "  .storyLayout {", `  .reelCopy {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 2rem clamp(2.5rem, 5vw, 5rem);
    align-items: end;
  }

`);

css += `
@media (max-width: 640px) {
  .page a.light {
    width: 100%;
  }
}
`;
css = css.replace(/@media \(prefers-reduced-motion: reduce\) \{\n  \.video \{\n    transition: none;\n  \}\n\}/, `@media (prefers-reduced-motion: reduce) {
  .page a.light {
    transition: none;
  }
}`);

fs.writeFileSync(file, css);
console.log("left:", css.match(/reelPoints|reelIntro|reelAside|screen figcaption/g));

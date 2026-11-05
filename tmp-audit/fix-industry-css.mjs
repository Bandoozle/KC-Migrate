import fs from "node:fs";

const p = "src/components/industry/IndustryServicePage.module.css";
let s = fs.readFileSync(p, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const start = s.indexOf("/* Medical & dental: numbered clinical rows");
const end = s.indexOf("/* Golf: one scorecard row");
if (start < 0 || end < 0) throw new Error(`markers ${start} ${end}`);

const block = `/* Dental and medical aesthetics: numbered clinical rows, like entries on a chart */
:global(.industry-dental) .benefitGrid,
:global(.industry-medical-aesthetics) .benefitGrid {
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  border-top: 1px solid var(--ind-rule);
}

:global(.industry-dental) .benefit,
:global(.industry-medical-aesthetics) .benefit {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  column-gap: 1rem;
  margin-top: 0;
  padding: 1.25rem 0.75rem;
  border: 0;
  border-bottom: 1px solid var(--ind-rule);
  border-radius: 0;
  background: transparent;
}

:global(.industry-dental) .benefit::before,
:global(.industry-medical-aesthetics) .benefit::before {
  content: counter(benefit);
  grid-row: 1 / 3;
  width: 2.25rem;
  min-width: 0;
  height: 2.25rem;
  margin: 0;
  padding: 0;
}

@media (hover: hover) and (pointer: fine) {
  :global(.industry-dental) .benefit:hover,
  :global(.industry-medical-aesthetics) .benefit:hover {
    transform: none;
    box-shadow: none;
    border-color: var(--ind-rule);
    background: var(--ind-tint);
  }
}

@media (min-width: 840px) {
  :global(.industry-dental) .benefit,
  :global(.industry-medical-aesthetics) .benefit {
    grid-template-columns: 2.75rem minmax(0, 0.8fr) minmax(0, 1.4fr);
    align-items: baseline;
  }

  :global(.industry-dental) .benefit::before,
  :global(.industry-medical-aesthetics) .benefit::before {
    grid-row: auto;
    align-self: center;
  }

  :global(.industry-dental) .benefitTitle,
  :global(.industry-medical-aesthetics) .benefitTitle {
    margin: 0;
  }
}

`;

fs.writeFileSync(p, s.slice(0, start) + block + s.slice(end));
console.log("fixed");

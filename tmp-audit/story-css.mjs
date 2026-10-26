import { readFileSync, writeFileSync } from "node:fs";

const file = "src/components/sections/television/TelevisionAdvertisingPage.module.css";
const raw = readFileSync(file, "utf8");
const crlf = raw.includes("\r\n");
const css = raw.replace(/\r\n/g, "\n");
const start = css.indexOf(".storyLayout {\n  display: grid;\n  gap: 1.5rem;\n}");
const endMarker = '.frame[aria-pressed="true"] {\n  border-top: 2px solid #ffffff;\n  color: #ffffff;\n  font-weight: 600;\n}\n';
const end = css.indexOf(endMarker);
if (start < 0 || end < start) throw new Error(`markers not found ${start} ${end}`);

const block = `.storyLayout {
  display: grid;
  grid-template-areas:
    "copy"
    "tabs"
    "screen"
    "detail";
  gap: 1.5rem;
}

.storyCopy {
  grid-area: copy;
}

.storyScreen {
  grid-area: screen;
  margin: 0;
}

.storyMonitor {
  position: relative;
  aspect-ratio: 16 / 9;
  container-type: inline-size;
  overflow: hidden;
  border-radius: 4px;
  background: #000000;
}

.storyScreen figcaption {
  margin-top: 0.55rem;
  color: rgba(255, 255, 255, 0.68);
  font-size: var(--kosick-meta-size);
  font-weight: var(--kosick-meta-weight);
  line-height: var(--kosick-meta-leading);
}

.storyDetails {
  display: grid;
  grid-area: detail;
}

.storyDetail {
  grid-area: 1 / 1;
  min-width: 0;
}

.storyDetail[data-active="false"] {
  visibility: hidden;
}

.storyStepIndex {
  margin: 0 0 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--kosick-meta-size);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: var(--kosick-meta-leading);
}

.storyStepTitle {
  margin: 0;
  color: #ffffff;
  font-family: var(--kosick-font);
  font-size: var(--kosick-subsection-title-size);
  font-weight: var(--kosick-subsection-title-weight);
  letter-spacing: var(--kosick-subsection-title-tracking);
  line-height: var(--kosick-subsection-title-leading);
  text-wrap: balance;
}

.storyStepBody {
  max-width: 34rem;
  margin: 0.75rem 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: var(--kosick-body-size);
  line-height: var(--kosick-body-leading);
}

.storyStepDetail {
  max-width: 34rem;
  margin: 0.75rem 0 0;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.62);
  font-size: var(--kosick-meta-size);
  line-height: var(--kosick-meta-leading);
}

.frames {
  display: grid;
  grid-area: tabs;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.frame {
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr);
  gap: 0.7rem;
  align-items: start;
  width: 100%;
  padding: 0.85rem 0;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.62);
  font-size: var(--kosick-body-size);
  font-weight: 600;
  line-height: var(--kosick-body-leading);
  transition: color 160ms ease-out;
}

.frame:hover {
  color: #ffffff;
}

.frame[aria-selected="true"] {
  border-top: 2px solid #ffffff;
  padding-top: calc(0.85rem - 1px);
  color: #ffffff;
}

.timeline .frame {
  color: rgba(255, 255, 255, 0.86);
  cursor: default;
}
`;

const next = css.slice(0, start) + block + css.slice(end + endMarker.length);
writeFileSync(file, crlf ? next.replace(/\n/g, "\r\n") : next, "utf8");
console.log("replaced", end + endMarker.length - start, "chars");

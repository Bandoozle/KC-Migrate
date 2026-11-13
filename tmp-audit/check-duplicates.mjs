import fs from "node:fs";
import path from "node:path";

const targets = [
  ["retail-marketing", "arcteryx-billboard-advertising.jpg"],
  ["travel-marketing", "resort-marketing.jpg"],
  ["travel-marketing", "social-media-marketing.jpg"],
  ["television", "service-broadcast.jpg"],
  ["television", "ctv-living-room-tsn.jpg"],
  ["outdoor", "arcteryx-billboard-advertising.jpg"],
  ["outdoor", "billboards-scaled.png"],
  ["dental", "Dental-Vancouver.jpg"],
  ["golf", "golf-course-branding-marketing.jpg"],
  ["construction", "home-services-marketing.jpg"],
  ["medical-aesthetics", "lip-treatment.jpg"],
  ["medical-aesthetics", "aesthetic-clinic-marketing.jpg"],
  ["medical-aesthetics", "medical-skincare-marketing.jpg"],
  ["medical-aesthetics", "treatment-lounge.jpg"],
  ["medical-aesthetics", "clinic-interior.jpg"],
  ["medical-aesthetics", "medical-aesthetics.webp"],
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?|json)$/.test(e.name)) out.push(full);
  }
  return out;
}

const files = walk("src");
for (const [scope, needle] of targets) {
  const hits = [];
  for (const file of files) {
    const rel = file.replace(/\\/g, "/");
    if (!rel.includes(scope) && !rel.includes(scope.replace("-", ""))) continue;
    const text = fs.readFileSync(file, "utf8");
    let n = 0;
    let idx = 0;
    while ((idx = text.indexOf(needle, idx)) !== -1) {
      n++;
      idx += needle.length;
    }
    if (n) hits.push({ rel, n });
  }
  // also search whole src if scoped search empty
  if (!hits.length) {
    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      let n = 0;
      let idx = 0;
      while ((idx = text.indexOf(needle, idx)) !== -1) {
        n++;
        idx += needle.length;
      }
      if (n) hits.push({ rel: file.replace(/\\/g, "/"), n });
    }
  }
  const total = hits.reduce((s, h) => s + h.n, 0);
  console.log(`${needle} total=${total}`, hits.map((h) => `${h.rel}:${h.n}`).join(" | ") || "(none)");
}

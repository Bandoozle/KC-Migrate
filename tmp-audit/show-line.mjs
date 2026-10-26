import fs from "node:fs";
const source = fs.readFileSync("src/app/(native)/contact/page.tsx", "utf8");
const line = source.split(/\n/).find((entry) => entry.includes("getPageBySlug"));
console.log(JSON.stringify(line));

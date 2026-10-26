import { readFileSync } from "node:fs";

const file =
  "C:/Users/smarc/.cursor/projects/c-Users-smarc-OneDrive-Desktop-Projects-Kosick-Website/agent-transcripts/f0d4d1a1-721a-40fa-923b-729ad08f1cdd/f0d4d1a1-721a-40fa-923b-729ad08f1cdd.jsonl";
const lines = readFileSync(file, "utf8").split("\n");
const needle = process.argv[2];
lines.forEach((line, n) => {
  let text;
  try {
    text = JSON.stringify(JSON.parse(line));
  } catch {
    return;
  }
  const decoded = JSON.parse(line);
  const walk = (v) => {
    if (typeof v === "string") {
      let i = v.indexOf(needle);
      while (i >= 0) {
        console.log(`---- line ${n + 1} @${i}`);
        console.log(v.slice(Math.max(0, i - 200), i + 1200));
        i = v.indexOf(needle, i + 1);
      }
    } else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  if (text.includes(needle.slice(0, 20))) walk(decoded);
});

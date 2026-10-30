import fs from "node:fs";
const html = fs.readFileSync("tmp-parity/rest/hvac-lead-generation.html", "utf8");
const srcs = [...html.matchAll(/https:\/\/staging\.kosick\.com\/wp-content\/uploads\/[^"'\s]+/g)].map((m) => m[0]);
const unique = [...new Set(srcs)].filter((s) => !/-\d+x\d+\./.test(s));
console.log(unique.join("\n"));

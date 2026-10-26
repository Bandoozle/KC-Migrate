import fs from "fs";
const html = JSON.parse(fs.readFileSync("tmp-audit/dv-page.json", "utf8"))[0].content.rendered;
const links = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
  href: m[1],
  text: m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
}));
for (const link of links) console.log(`${link.text} -> ${link.href}`);

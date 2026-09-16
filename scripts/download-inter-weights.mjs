import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const cssUrl =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
const css = await fetch(cssUrl, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
}).then((r) => r.text());

const faces = [...css.matchAll(/@font-face\s*\{[\s\S]*?\}/gi)].map((m) => m[0]);
console.log("faces", faces.length);
const summary = faces.map((f) => ({
  weight: f.match(/font-weight:\s*([^;]+)/i)?.[1],
  unicode: f.match(/unicode-range:\s*([^;]+)/i)?.[1]?.slice(0, 24),
  file: f.match(/url\(([^)]+)\)/)?.[1],
}));
for (const row of summary) console.log(row.weight, row.unicode, row.file?.split("/").pop());

const dir = path.join(process.cwd(), "public", "wp-fonts", "inter");
await mkdir(dir, { recursive: true });

const urls = [...new Set(faces.map((f) => f.match(/url\(([^)]+)\)/)?.[1]).filter(Boolean))];
let saved = 0;
for (const url of urls) {
  const file = url.split("/").pop();
  const dest = path.join(dir, file);
  const res = await fetch(url);
  if (!res.ok) {
    console.error("FAIL", res.status, url);
    continue;
  }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  saved += 1;
  console.log("saved", file);
}
console.log(`downloaded ${saved}/${urls.length}`);
await writeFile(
  path.join(process.cwd(), "scripts", "inter-extra-faces.css"),
  css.replace(/https:\/\/fonts\.gstatic\.com\/s\/inter\/[^/]+\//g, "/wp-fonts/inter/"),
);
console.log("wrote scripts/inter-extra-faces.css");

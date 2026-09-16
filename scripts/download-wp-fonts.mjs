import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = "https://staging.kosick.com";
const cssHrefs = new Set();

for (const url of [
  `${origin}/`,
  `${origin}/services/`,
  `${origin}/services/digital-marketing/`,
  `${origin}/services/corporate-branding/`,
  `${origin}/services/creative/`,
  `${origin}/contact/`,
  `${origin}/feature-articles/`,
]) {
  const html = await fetch(url).then((r) => r.text());
  for (const match of html.matchAll(
    /href=['"](https:\/\/staging\.kosick\.com\/wp-content\/fonts\/[^'"]+\.css)['"]/gi,
  )) {
    cssHrefs.add(match[1]);
  }
}

const woff2 = new Set();
for (const href of cssHrefs) {
  const css = await fetch(href).then((r) => r.text());
  for (const match of css.matchAll(
    /https:\/\/staging\.kosick\.com\/wp-content\/fonts\/[^)'"\s]+\.woff2/gi,
  )) {
    woff2.add(match[0]);
  }
}

const root = path.join(process.cwd(), "public", "wp-fonts");
let ok = 0;
for (const url of [...woff2].sort()) {
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/").filter(Boolean);
  const family = parts[parts.length - 2];
  const file = parts[parts.length - 1];
  const dir = path.join(root, family);
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, file);
  const res = await fetch(url);
  if (!res.ok) {
    console.error("FAIL", res.status, url);
    continue;
  }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  ok += 1;
  console.log("saved", `${family}/${file}`, res.headers.get("content-type"), res.status);
}

console.log(`downloaded ${ok}/${woff2.size}`);

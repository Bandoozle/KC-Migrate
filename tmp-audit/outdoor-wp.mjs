import { writeFileSync } from "node:fs";

const base = "https://staging.kosick.com";
const page = await (await fetch(`${base}/wp-json/wp/v2/pages?slug=outdoor-advertising&_fields=id,content,modified`)).json();
const html = page[0].content.rendered;
writeFileSync("tmp-audit/outdoor-staging.html", html);
console.log("id", page[0].id, "modified", page[0].modified, "len", html.length);

const imgs = [...html.matchAll(/<img[^>]+>/gi)].map((m) => {
  const tag = m[0];
  return {
    src: tag.match(/src="([^"]+)"/)?.[1],
    alt: tag.match(/alt="([^"]*)"/)?.[1],
    w: tag.match(/width="(\d+)"/)?.[1],
    h: tag.match(/height="(\d+)"/)?.[1],
  };
});
console.log("\nIMAGES", imgs.length);
imgs.forEach((i) => console.log(`  ${i.w}x${i.h} ${i.src} | ${i.alt}`));

const links = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => `${m[1]} | ${m[2].replace(/<[^>]+>/g, "").trim()}`);
console.log("\nLINKS");
[...new Set(links)].forEach((l) => console.log("  ", l));

const text = html
  .replace(/<style[\s\S]*?<\/style>/gi, "")
  .replace(/<\/(p|h\d|li|figcaption|div)>/g, "\n")
  .replace(/<[^>]+>/g, "")
  .replace(/&#8217;/g, "’").replace(/&#8211;/g, "–").replace(/&#8212;/g, "—").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
  .split("\n").map((s) => s.trim()).filter((s) => s && !/^[.#@{]|kb-|kt-|wp-block/.test(s));
console.log("\nTEXT");
text.forEach((t, i) => console.log(`  [${i}] ${t}`));

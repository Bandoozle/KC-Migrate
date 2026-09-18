import { readFileSync } from "node:fs";
import { join } from "node:path";

const temp = process.env.TEMP || "";
for (const [name, file] of [
  ["email", "em.html"],
  ["social", "sm.html"],
  ["seo", "seo.html"],
]) {
  const html = readFileSync(join(temp, file), "utf8");
  const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1] || "";
  const headings = [...main.matchAll(/<(h1|h2|h3)[^>]*>([\s\S]*?)<\/\1>/g)].map((m) =>
    m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  console.log({
    name,
    kosickNative: html.includes("kosick-native"),
    kbInMain: /kb-row-layout|wp-block-kadence|n2-ss/.test(main),
    imgs: (main.match(/<img /g) || []).length,
    videos: (main.match(/<video /g) || []).length,
    h2: (main.match(/<h2/g) || []).length,
    headings: headings.slice(0, 20),
  });
}

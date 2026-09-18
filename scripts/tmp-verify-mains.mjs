import { readFileSync } from "node:fs";
import { join } from "node:path";

const temp = process.env.TEMP || process.env.TMPDIR || "/tmp";
const files = {
  services: join(temp, "svc2.html"),
  results: join(temp, "mr2.html"),
  programs: join(temp, "mp2.html"),
  thanks: join(temp, "th2.html"),
};

for (const [name, path] of Object.entries(files)) {
  const html = readFileSync(path, "utf8");
  const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1] || "";
  const headings = [...main.matchAll(/<(h1|h2)[^>]*>([\s\S]*?)<\/\1>/g)].map((m) =>
    m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  );
  console.log({
    name,
    mainLen: main.length,
    imgs: (main.match(/<img /g) || []).length,
    h2: (main.match(/<h2/g) || []).length,
    labels: (main.match(/__label/g) || []).length,
    heroSlides: (main.match(/HeroBanner-module__[^"]*__slide/g) || []).length,
    headings,
  });
}

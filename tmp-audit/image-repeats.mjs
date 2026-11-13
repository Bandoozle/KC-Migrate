import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = "src";
const pattern = /(\/wp-content\/uploads\/[^`"'\s)]+?\.(?:jpe?g|png|webp)|\/images\/[^`"'\s)]+?\.(?:jpe?g|png|webp))/gi;
const uses = new Map();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (!path.includes(join("src", "content"))) walk(path);
    } else if (/\.(tsx?|css)$/.test(name)) {
      for (const match of readFileSync(path, "utf8").matchAll(pattern)) {
        const list = uses.get(match[1]) ?? new Set();
        list.add(relative(root, path).replace(/\\/g, "/"));
        uses.set(match[1], list);
      }
    }
  }
}

walk(root);
[...uses.entries()]
  .filter(([, files]) => files.size > 1)
  .sort((a, b) => b[1].size - a[1].size)
  .forEach(([src, files]) => console.log(`${files.size}\t${src}\n\t${[...files].join("\n\t")}`));

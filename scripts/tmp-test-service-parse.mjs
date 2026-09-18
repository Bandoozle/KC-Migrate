import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// Use compiled-free approach: duplicate minimal by importing via tsx if available
// Fallback: spawn through next isn't easy; re-implement call via dynamic import of built path.

const require = createRequire(import.meta.url);

async function main() {
  // Register ts via node --experimental or just use cheerio parse copy
  const { pathToFileURL } = await import("node:url");
  // Directly eval by running through npx tsx
  console.log("use tsx runner");
}

main();

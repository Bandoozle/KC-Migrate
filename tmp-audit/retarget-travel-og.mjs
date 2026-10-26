import { readFileSync, writeFileSync } from "node:fs";

const file = "src/lib/seo/rank-math-snapshot.json";
const snapshot = JSON.parse(readFileSync(file, "utf8"));
const page = snapshot.pages["/travel-marketing-canada/"];
const local = "https://www.kosick.com/images/articles/travel-marketing-canada-cruise.jpg";

function walk(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach(walk);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === "string" && value.includes("/wp-content/uploads/2026/10/travel-marketing-canada-cruise")) {
      node[key] = local;
    } else {
      walk(value);
    }
  }
  if (node["@type"] === "ImageObject" && node.url === local) {
    node.width = "1536";
    node.height = "1024";
  }
}

page.ogImage = local;
walk(page.jsonLd);
writeFileSync(file, JSON.stringify(snapshot));
const check = JSON.stringify(snapshot.pages["/travel-marketing-canada/"]);
console.log("remaining uploads", check.includes("wp-content/uploads/2026/10/travel-marketing-canada-cruise"));
console.log("og", snapshot.pages["/travel-marketing-canada/"].ogImage);

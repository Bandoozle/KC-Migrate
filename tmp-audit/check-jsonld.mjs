import snapshot from "../src/lib/seo/rank-math-snapshot.json" with { type: "json" };

for (const path of ["/", "/services/outdoor-advertising/", "/services/website-development/", "/corporate-events/"]) {
  const blocks = snapshot.pages[path].jsonLd;
  console.log(path, "blocks", blocks.length);
  for (const block of blocks) {
    const graph = block["@graph"];
    const types = Array.isArray(graph) ? graph.map((node) => JSON.stringify(node["@type"])) : [JSON.stringify(block["@type"])];
    console.log(" ", types.join(" | "), "bytes", JSON.stringify(block).length);
  }
}

const paths = ["/", "/corporate-events/", "/services/website-development/", "/services/outdoor-advertising/", "/travel-marketing-canada/", "/shopify-vs-woocommerce/", "/corporate-events-group-travel/"];
for (const path of paths) {
  const html = await (await fetch(`http://127.0.0.1:3010${path}`)).text();
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/gi)].length;
  console.log(path, "scripts", scripts, "mov", html.includes(".mov"), "unavailable", html.includes("temporarily unavailable"), "title", html.match(/<title>([^<]*)<\/title>/)?.[1]);
}

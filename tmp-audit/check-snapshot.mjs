import snapshot from "../src/lib/seo/rank-math-snapshot.json" with { type: "json" };

const paths = ["/", "/contact/", "/corporate-events/", "/travel-marketing-canada/", "/marketing-programs/", "/thanks/"];
for (const path of paths) {
  const page = snapshot.pages[path];
  const types = (page?.jsonLd || []).map((block) => {
    if (block && typeof block === "object" && "@graph" in block) {
      return block["@graph"].map((node) => node["@type"]);
    }
    return block?.["@type"] || "unknown";
  });
  console.log(path, page?.title, "|", page?.canonical, "|", page?.description?.slice(0, 80), "|", JSON.stringify(types));
}
console.log("url count", snapshot.urls.length, "page count", Object.keys(snapshot.pages).length);
console.log("ga4 in urls", snapshot.urls.some((url) => url.includes("ga4-new")));
console.log("bytes", Buffer.byteLength(JSON.stringify(snapshot)));

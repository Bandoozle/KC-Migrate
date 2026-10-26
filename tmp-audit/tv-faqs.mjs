const html = await (await fetch("http://localhost:3001/services/television-advertising/")).text();
const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
for (const block of match) {
  const json = block.replace(/<script[^>]*>|<\/script>/g, "");
  try {
    const data = JSON.parse(json);
    const graph = data["@graph"] || [data];
    for (const node of graph) {
      if (node["@type"] === "FAQPage") {
        for (const q of node.mainEntity) console.log(`\nQ: ${q.name}\nA: ${q.acceptedAnswer.text.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ")}`);
      }
    }
  } catch {}
}

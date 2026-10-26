const origin = "https://staging.kosick.com";
const pages = await fetch(`${origin}/wp-json/wp/v2/pages?slug=website-development&_fields=content`).then((r) => r.json());
const html = pages[0].content.rendered;
const titles = ["DirectBuy", "Chilliwack", "Padwood", "Skinfolio", "Sparkle", "Honest", "Cool Comfort", "Strueby"];
for (const title of titles) {
  const idx = html.toLowerCase().indexOf(title.toLowerCase());
  console.log("\n====", title, idx);
  if (idx < 0) continue;
  const slice = html.slice(Math.max(0, idx - 200), idx + 700);
  const text = slice
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  console.log(text.slice(0, 500));
}

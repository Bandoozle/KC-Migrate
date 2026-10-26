const slugs = ["outdoor-advertising", "billboard-dimensions"];
for (const slug of slugs) {
  const rest = await fetch(
    `https://staging.kosick.com/wp-json/wp/v2/pages?slug=${slug}&_fields=title,content,excerpt`,
  ).then((r) => r.json());
  const page = rest[0];
  if (!page) {
    console.log("\nMISSING", slug);
    continue;
  }
  const html = page.content.rendered;
  const headings = [...html.matchAll(/<(h[1-6]|p)[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) =>
    m[2].replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#8217;/g, "’").replace(/\s+/g, " ").trim(),
  ).filter((t) => t && t.length < 400);
  const imgs = [...html.matchAll(/https:\/\/staging\.kosick\.com\/wp-content\/uploads\/[^"' )\s]+/g)].map((m) => m[0]);
  const links = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({
    href: m[1],
    text: m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 80),
  })).filter((l) => l.text);
  console.log("\n====", slug, page.title.rendered);
  console.log("HEADINGS/PARAS");
  for (const line of headings) console.log("-", line.slice(0, 220));
  console.log("IMAGES");
  for (const src of [...new Set(imgs)]) console.log(src);
  console.log("LINKS");
  for (const link of links.slice(0, 30)) console.log(link.text, "->", link.href);
}

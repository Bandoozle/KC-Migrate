const base = "https://staging.kosick.com";
for (const slug of ["the-power-of-radio-advertising", "blog-media-buying-canada-tv-streaming-radio"]) {
  let item = null;
  for (const type of ["posts", "pages"]) {
    const r = await fetch(`${base}/wp-json/wp/v2/${type}?slug=${slug}&_fields=id,title,content,excerpt,date,featured_media,link`);
    const j = r.ok ? await r.json() : [];
    if (j.length) { item = { ...j[0], type }; break; }
  }
  if (!item) { console.log(slug, "NOT FOUND"); continue; }
  const html = item.content.rendered;
  const text = html
    .replace(/<\/(p|h\d|li|figcaption)>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#8217;/g, "’").replace(/&#8211;/g, "–").replace(/&#8212;/g, "—")
    .replace(/&#8220;|&#8221;/g, '"').replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
    .replace(/\n\s*\n+/g, "\n");
  console.log(`\n===== ${slug} (${item.type} ${item.id}) ${item.date} featured=${item.featured_media}`);
  console.log("title:", item.title.rendered);
  const imgs = [...new Set(html.match(/https?:[^"' ]+\.(jpe?g|png|webp|svg)/gi) || [])].filter((u) => !/-\d+x\d+\./.test(u));
  console.log("images:", imgs);
  console.log("audio:", (html.match(/<audio[^>]*>|\.mp3/gi) || []));
  console.log(text);
}

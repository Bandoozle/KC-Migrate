const base = "https://staging.kosick.com";
for (const type of ["pages", "posts"]) {
  const r = await fetch(`${base}/wp-json/wp/v2/${type}?search=pattison&per_page=50&_fields=slug,link,content`);
  const items = await r.json();
  for (const item of items) {
    const html = item.content.rendered;
    const hits = [...html.matchAll(/[^<>]{0,200}pattison[^<>]{0,200}/gi)].map((m) => m[0].replace(/\s+/g, " ").trim()).slice(0, 4);
    const imgs = [...new Set(html.match(/https?:\/\/[^"' ]*pattison[^"' ]*/gi) || [])];
    console.log(`\n${type} ${item.slug}`, imgs, hits);
  }
}
for (const term of ["outfront", "astral", "lamar", "clear channel", "billboard", "transit", "bus", "shelter", "superboard", "outdoor", "mockup", "smartmockups", "tsa", "poster", "bench", "skytrain"]) {
  const r = await fetch(`${base}/wp-json/wp/v2/media?search=${encodeURIComponent(term)}&per_page=100&_fields=source_url,date,media_details`);
  const items = r.ok ? await r.json() : [];
  console.log(`\n[${term}] ${items.length}`);
  items.forEach((i) => console.log(`   ${i.date.slice(0, 10)} ${i.media_details?.width}x${i.media_details?.height} ${i.source_url}`));
}

const base = "https://staging.kosick.com";
const total = await fetch(`${base}/wp-json/wp/v2/media?per_page=1&_fields=id`);
console.log("media total:", total.headers.get("x-wp-total"), "status", total.status);
for (const mime of ["audio/mpeg", "audio/mp4", "audio/wav", "audio/x-m4a"]) {
  const r = await fetch(`${base}/wp-json/wp/v2/media?mime_type=${encodeURIComponent(mime)}&per_page=100&_fields=id,source_url`);
  console.log(mime, r.status, r.headers.get("x-wp-total"));
}
for (const term of ["radio", "station", "jingle", "spot", "audio", "logo", "corus", "bell", "rogers", "stingray", "pattison", "jack", "cknw", "virgin", "kiss", "podcast", "spotify", "siriusxm", "global news", "sound"]) {
  const r = await fetch(`${base}/wp-json/wp/v2/media?search=${encodeURIComponent(term)}&per_page=100&_fields=id,source_url,mime_type,title`);
  const items = r.ok ? await r.json() : [];
  console.log(`\n[${term}] ${items.length}`);
  items.slice(0, 25).forEach((i) => console.log(`   ${i.mime_type} ${i.source_url}`));
}

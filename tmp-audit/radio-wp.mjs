import { writeFileSync } from "node:fs";

const bases = ["https://staging.kosick.com", "https://www.kosick.com"];
for (const base of bases) {
  try {
    const page = await (await fetch(`${base}/wp-json/wp/v2/pages?slug=radio-advertising&_fields=id,title,content,excerpt,modified`)).json();
    const html = page?.[0]?.content?.rendered || "";
    writeFileSync(`tmp-audit/radio-${new URL(base).hostname}.html`, html);
    console.log(`\n# ${base} page id=${page?.[0]?.id} modified=${page?.[0]?.modified} html=${html.length}`);
    const media = [...new Set(html.match(/https?:[^"' )]+\.(mp3|m4a|wav|ogg|aac|mp4|webm|png|jpe?g|webp|svg)/gi) || [])];
    console.log("assets in page:", media.length);
    media.forEach((m) => console.log("  ", m));
    console.log("audio tags:", (html.match(/<audio|wp-block-audio|\[audio/gi) || []).length);

    let pageNo = 1;
    const audio = [];
    while (pageNo < 6) {
      const r = await fetch(`${base}/wp-json/wp/v2/media?media_type=audio&per_page=100&page=${pageNo}&_fields=id,source_url,title,date,mime_type,media_details`);
      if (!r.ok) break;
      const items = await r.json();
      if (!items.length) break;
      audio.push(...items);
      pageNo++;
    }
    console.log(`audio media in library: ${audio.length}`);
    audio.forEach((a) => console.log(`   ${a.date} ${a.mime_type} ${a.source_url} | ${a.title?.rendered} | ${a.media_details?.length_formatted || ""}`));
  } catch (e) {
    console.log(base, "ERR", String(e));
  }
}

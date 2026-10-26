const url = "https://staging.kosick.com/wp-json/wp/v2/pages?slug=television-advertising&_fields=content";
const response = await fetch(url);
const pages = await response.json();
const html = pages[0]?.content?.rendered || "";
const hits = [...html.matchAll(/trane|mp4|vimeo|youtube|video/gi)].slice(0, 40).map((match) => {
  const start = Math.max(0, match.index - 80);
  return html.slice(start, match.index + 120).replace(/\s+/g, " ");
});
console.log(hits.join("\n---\n"));

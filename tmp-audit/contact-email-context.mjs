const response = await fetch("https://staging.kosick.com/wp-json/wp/v2/pages?slug=contact&_fields=content");
const data = await response.json();
const html = data?.[0]?.content?.rendered || "";
const index = html.toLowerCase().indexOf("info@kosick.com");
console.log("status", response.status, "length", html.length, "info index", index);
if (index >= 0) console.log(html.slice(Math.max(0, index - 180), index + 180).replace(/\s+/g, " "));
const action = html.match(/email[^<]{0,80}/gi);
console.log("email snippets", (action || []).slice(0, 12));

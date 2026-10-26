const rest = await fetch("https://staging.kosick.com/wp-json/wp/v2/pages?slug=contact&_fields=content").then((r) => r.json());
const html = rest[0].content.rendered;
const $start = html.indexOf("VANCOUVER");
console.log(html.slice($start - 400, $start + 1800));

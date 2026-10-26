const page = await fetch("http://127.0.0.1:3001/contact/").then((r) => r.text());
const imgs = [...page.matchAll(/https:\/\/staging\.kosick\.com\/wp-content\/uploads\/[^"'\s)]+/g)].map((m) => m[0]);
console.log("images", [...new Set(imgs)].join("\n"));

const origin = "https://staging.kosick.com";
const rest = await fetch(`${origin}/wp-json/wp/v2/pages?slug=contact&_fields=content,title`).then((r) => r.json());
const html = rest[0]?.content?.rendered || "";
const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log("\nlinks", [...new Set(links)].join("\n"));
const imgTags = [...html.matchAll(/<img[^>]+>/g)].map((m) => m[0]);
console.log("\nwp images\n", imgTags.join("\n"));
const text = html.replace(/<[^>]+>/g, "\n").replace(/&amp;/g, "&").replace(/\n+/g, "\n");
console.log("\ntext\n", text.slice(0, 2500));

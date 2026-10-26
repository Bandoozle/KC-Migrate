const response = await fetch("http://127.0.0.1:3001/contact/");
const html = await response.text();
console.log("status", response.status, "len", html.length);
const hits = html.match(/Clovelly|Calgary|Phoenix|Gold Canyon|maps\.google|google\.com\/maps|mailto:[^"'\s]+|tel:[^"'\s]+|wp-content\/uploads[^"']+/gi) || [];
console.log([...new Set(hits)].join("\n"));
const start = html.indexOf("Contact Information");
console.log("\n--- snippet ---\n");
console.log(html.slice(Math.max(0, start - 200), start + 2500).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 1800));

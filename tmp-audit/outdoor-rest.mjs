const html = await fetch("http://127.0.0.1:3001/services/outdoor-advertising/").then((r) => r.text());
const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, "\n")
  .replace(/&amp;/g, "&")
  .replace(/&#x27;|&#8217;/g, "'")
  .replace(/&nbsp;/g, " ");
const lines = text.split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter((line) => line.length > 1);
const start = lines.findIndex((line) => line === "Strategic");
console.log(lines.slice(start, start + 160).join("\n"));

const html = await fetch("https://staging.kosick.com/").then((r) => r.text());
const i = html.indexOf("Kosick In");
console.log(html.slice(i, i + 2500).replace(/\s+/g, " ").slice(0, 2000));
console.log("\n--- slides onclick", (html.match(/n2-ss-slide/g) || []).length);
console.log("sbi items", (html.match(/sbi_item /g) || []).length);

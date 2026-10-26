const paths = process.argv[2].split(",");
const pattern = new RegExp(process.argv[3], "i");
for (const path of paths) {
  const html = await (await fetch(`http://localhost:3001${path}`)).text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&#x27;|&#039;/g, "'")
    .replace(/&amp;/g, "&");
  const lines = [...new Set(text.split("\n").map((l) => l.trim()).filter((l) => l.length > 3))];
  console.log(`\n# ${path}`);
  lines.forEach((line, i) => {
    if (pattern.test(line)) console.log(`  [${i}] ${line.slice(0, 400)}`);
  });
}

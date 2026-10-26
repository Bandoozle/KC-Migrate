const targets = [
  ["https://www.kosick.com/corporate-events/", "cityscape-of-capital"],
  ["https://www.kosick.com/services/outdoor-advertising/", "smartmockups_ljx6qkvg"],
  ["https://www.kosick.com/services/website-development/", "Screen-Recording-2024-03-14"],
];

for (const [url, needle] of targets) {
  const html = await (await fetch(url)).text();
  const index = html.indexOf(needle);
  console.log("\n==", url, "found", index);
  if (index >= 0) console.log(html.slice(Math.max(0, index - 400), index + 500).replace(/\s+/g, " "));
}

const form = await fetch("https://staging.kosick.com/wp-json/wp/v2/kadence_form/11283");
console.log("\nform status", form.status, form.headers.get("content-type"));
const text = await form.text();
console.log(text.slice(0, 500));

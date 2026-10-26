const html = await (await fetch("http://127.0.0.1:3010/travel-marketing-canada/")).text();
const needle = "travel-marketing-canada-cruise.jpg";
let from = 0;
while (from < html.length) {
  const index = html.indexOf(needle, from);
  if (index < 0) break;
  console.log(html.slice(Math.max(0, index - 120), index + 80).replace(/\s+/g, " "));
  console.log("---");
  from = index + needle.length;
}

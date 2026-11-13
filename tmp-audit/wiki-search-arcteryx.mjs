const url =
  "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Arc'teryx%20logo&srnamespace=6&format=json&origin=*";
const res = await fetch(url, {
  headers: { "User-Agent": "KosickWebsiteBot/1.0 (local asset prep)" },
});
const json = await res.json();
console.log(JSON.stringify(json.query?.search?.slice(0, 10), null, 2));

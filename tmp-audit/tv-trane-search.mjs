const queries = ["HeatUnit", "Trane_WRT", "WRT", "0232", "trane-web"];
for (const query of queries) {
  const url = `https://staging.kosick.com/wp-json/wp/v2/media?search=${encodeURIComponent(query)}&per_page=20&_fields=source_url,alt_text,mime_type,media_details`;
  const response = await fetch(url);
  const items = await response.json();
  console.log("\n==", query, Array.isArray(items) ? items.length : response.status);
  if (!Array.isArray(items)) continue;
  for (const item of items) {
    console.log(item.media_details?.width, item.source_url);
  }
}
